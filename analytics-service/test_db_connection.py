"""
Quick database connection test.
Run: python test_db_connection.py
"""
import sys
from sqlalchemy import create_engine, URL, text
from app.config import settings

def test_connection():
    print(f"\n{'='*50}")
    print("  Database Connection Test")
    print(f"{'='*50}")
    print(f"  Host     : {settings.db_host}:{settings.db_port}")
    print(f"  Database : {settings.db_name}")
    print(f"  User     : {settings.db_user}")
    print(f"  Password : {'*' * len(settings.db_password)}")
    print(f"{'='*50}\n")

    db_url = URL.create(
        drivername="postgresql+psycopg2",
        username=settings.db_user,
        password=settings.db_password,
        host=settings.db_host,
        port=settings.db_port,
        database=settings.db_name,
    )

    try:
        engine = create_engine(db_url, pool_pre_ping=True)

        with engine.connect() as conn:
            # Basic connectivity
            result = conn.execute(text("SELECT version()"))
            version = result.scalar()
            print(f"[OK] Connected successfully")
            print(f"     {version}\n")

            # Check tables exist
            result = conn.execute(text("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                ORDER BY table_name
            """))
            tables = [row[0] for row in result]

            if tables:
                print(f"[OK] Tables found ({len(tables)}):")
                for t in tables:
                    print(f"     - {t}")
            else:
                print("[WARN] No tables found yet (run the Spring Boot services first to create them)")

            print()

            # Row counts for known tables
            expected = ["users", "polls", "poll_options", "votes"]
            for table in expected:
                if table in tables:
                    count = conn.execute(text(f"SELECT COUNT(*) FROM {table}")).scalar()
                    print(f"[OK] {table:<15} {count} row(s)")
                else:
                    print(f"[--] {table:<15} table not found")

        print(f"\n{'='*50}")
        print("  Result: CONNECTION SUCCESSFUL")
        print(f"{'='*50}\n")
        return True

    except Exception as e:
        print(f"[FAIL] Connection failed:\n       {e}")
        print(f"\n{'='*50}")
        print("  Result: CONNECTION FAILED")
        print(f"{'='*50}\n")
        return False


if __name__ == "__main__":
    ok = test_connection()
    sys.exit(0 if ok else 1)
