// com.server.service.TagService.java

package com.server.service;

import com.server.entity.Tag;
import com.server.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    public List<String> getAllTagNames() {
        return tagRepository.findAll().stream()
                .map(Tag::getName)
                .collect(Collectors.toList());
    }
}
