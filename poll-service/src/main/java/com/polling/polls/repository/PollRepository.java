package com.polling.polls.repository;

import com.polling.polls.entity.Poll;
import com.polling.polls.entity.PollStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {
    List<Poll> findByStatus(PollStatus status);
    List<Poll> findByCreatedByOrderByCreatedAtDesc(String createdBy);
    List<Poll> findAllByOrderByCreatedAtDesc();
}
