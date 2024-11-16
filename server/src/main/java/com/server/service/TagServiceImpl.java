// com.server.service.TagServiceImpl.java

package com.server.service;

import com.server.entity.Tag;
import com.server.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    @Autowired
    public TagServiceImpl(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Override
    public List<String> getAllTagNames() {
        return tagRepository.findAll().stream()
                .map(Tag::getName)
                .collect(Collectors.toList());
    }
    @Override
    @Transactional
    public void initializePostsForAllTags() {
        List<Tag> allTags = tagRepository.findAll();
        for (Tag tag : allTags) {
            if (tag.getPosts() == null) {
                tag.setPosts(new HashSet<>());
                tagRepository.save(tag);
            }
        }
    }
    @Override
    @Transactional
    public void deleteTagIfUnused(Tag tag) {
        if (tag.getPosts().isEmpty()) {
            tagRepository.delete(tag);
            System.out.println("삭제된 태그: " + tag.getName());
        }
    }
}
