// com.server.controller.TagController.java

package com.server.controller;

import com.server.entity.Tag;
import com.server.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    @Autowired
    private TagService tagService;

    // 모든 태그를 가져오는 엔드포인트
    @GetMapping
    public ResponseEntity<List<String>> getAllTags() {
        List<String> tags = tagService.getAllTagNames();
        return ResponseEntity.ok(tags);
    }
}
