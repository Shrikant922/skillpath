package com.skillpath;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SkillpathBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SkillpathBackendApplication.class, args);
	}

}
