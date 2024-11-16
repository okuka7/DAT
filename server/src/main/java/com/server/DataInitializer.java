// src/main/java/com/server/DataInitializer.java

package com.server;

import com.server.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private TagService tagService;

    @Override
    public void run(String... args) throws Exception {
        tagService.initializePostsForAllTags();
    }
}
