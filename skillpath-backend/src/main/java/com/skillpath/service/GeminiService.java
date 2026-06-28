package com.skillpath.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillpath.dto.GeminiRequest;
import com.skillpath.dto.GeminiResponse;
import com.skillpath.entity.Milestone;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class GeminiService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public GeminiService() {
        this.restClient = RestClient.create();
        this.objectMapper = new ObjectMapper();
    }

    public List<Milestone> generateRoadmap(String targetRole, String skillLevel) {
        if ("YOUR_GEMINI_API_KEY_HERE".equals(apiKey)) {
            List<Milestone> mockMilestones = new ArrayList<>();
            for (int i = 1; i <= 8; i++) {
                mockMilestones.add(Milestone.builder()
                        .weekNumber(i)
                        .title("Week " + i + ": " + targetRole + " Basics")
                        .description("Learn the fundamentals for week " + i)
                        .resourceLink("https://example.com/week" + i)
                        .isCompleted(false)
                        .build());
            }
            return mockMilestones;
        }

        String prompt = String.format("You are an expert career coach and technical mentor. " +
                "Generate a learning roadmap for a %s at a %s level. " +
                "The roadmap MUST be exactly 8 weeks long. " +
                "Return the response ONLY as a valid JSON array of objects. Do not include markdown tags like ```json. " +
                "Each object must have the following keys: 'weekNumber' (integer), 'title' (string), 'description' (string), and 'resourceLink' (string). " +
                "Ensure exactly 8 objects in the array.", targetRole, skillLevel);

        GeminiRequest request = GeminiRequest.builder()
                .contents(List.of(GeminiRequest.Content.builder()
                        .parts(List.of(GeminiRequest.Part.builder()
                                .text(prompt)
                                .build()))
                        .build()))
                .build();

        String uri = apiUrl + "?key=" + apiKey;

        GeminiResponse response = restClient.post()
                .uri(uri)
                .body(request)
                .retrieve()
                .body(GeminiResponse.class);

        if (response != null && response.getCandidates() != null && !response.getCandidates().isEmpty()) {
            String jsonOutput = response.getCandidates().get(0).getContent().getParts().get(0).getText();
            
            // Clean up any potential markdown formatting the AI might add despite instructions
            jsonOutput = jsonOutput.replaceAll("```json", "").replaceAll("```", "").trim();

            try {
                return objectMapper.readValue(jsonOutput, new TypeReference<List<Milestone>>() {});
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to parse Gemini API response into Milestones", e);
            }
        }

        return new ArrayList<>();
    }
}
