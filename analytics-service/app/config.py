from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    db_host: str = "localhost"
    db_port: int = 5433
    db_name: str = "pollingdb"
    db_user: str = "postgres"
    db_password: str = "R8#vT2@zP9!kLm$Xq7"
    app_name: str = "Analytics Service"
    debug: bool = False

    class Config:
        env_file = ".env"


settings = Settings()
