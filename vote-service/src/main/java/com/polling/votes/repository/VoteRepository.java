package com.polling.votes.repository;

import com.polling.votes.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {

    boolean existsByPollIdAndVoterFingerprint(Long pollId, String voterFingerprint);

    long countByPollId(Long pollId);

    long countByPollIdAndOptionId(Long pollId, Long optionId);

    @Query("SELECT v.optionId as optionId, COUNT(v) as voteCount FROM Vote v WHERE v.pollId = :pollId GROUP BY v.optionId")
    List<Object[]> countVotesByOption(@Param("pollId") Long pollId);
}
