// com.server.service.TagService.java

package com.server.service;

import com.server.entity.Tag;

import java.util.List;

public interface TagService {
    List<String> getAllTagNames();
    void initializePostsForAllTags();
    void deleteTagIfUnused(Tag tag);
}
