package com.Tennis_EMS;

import com.Tennis_EMS.DTO.SeedResultDTO;
import com.Tennis_EMS.Service.DevSeedService;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;

public class SeedDataMain {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = null;

        try {
            context = new SpringApplicationBuilder(TennisEmsApplication.class)
                    .web(WebApplicationType.NONE)
                    .run(args);

            DevSeedService devSeedService = context.getBean(DevSeedService.class);

            System.out.println("========================================");
            System.out.println("Starting development seed process...");
            System.out.println("========================================");

            SeedResultDTO result = devSeedService.seedAll();

            System.out.println();
            System.out.println("========================================");
            System.out.println("Seed process finished.");
            System.out.println("Success: " + result.isSuccess());
            System.out.println("========================================");

            System.out.println("Users created: " + result.getUsersCreated());
            System.out.println("Admin profiles created: " + result.getAdminProfilesCreated());
            System.out.println("Coach profiles created: " + result.getCoachProfilesCreated());
            System.out.println("Student profiles created: " + result.getStudentProfilesCreated());

            System.out.println("Courses created: " + result.getCoursesCreated());
            System.out.println("Courts created: " + result.getCourtsCreated());
            System.out.println("Sections created: " + result.getSectionsCreated());
            System.out.println("Sessions created: " + result.getSessionsCreated());
            System.out.println("Enrollments created: " + result.getEnrollmentsCreated());
            System.out.println("Session attendances created: " + result.getSessionAttendancesCreated());
            System.out.println("Session notes created: " + result.getSessionNotesCreated());
            System.out.println("Session assessments created: " + result.getSessionAssessmentsCreated());

            System.out.println("Scoring formats created: " + result.getScoringFormatsCreated());
            System.out.println("Training matches created: " + result.getTrainingMatchesCreated());
            System.out.println("Match side players created: " + result.getMatchSidePlayersCreated());
            System.out.println("Match summaries created: " + result.getMatchSummariesCreated());
            System.out.println("Match segments created: " + result.getMatchSegmentsCreated());

            System.out.println("Training groups created: " + result.getTrainingGroupsCreated());
            System.out.println("Training group members created: " + result.getTrainingGroupMembersCreated());

            System.out.println();
            System.out.println("Messages:");
            if (result.getMessages() != null && !result.getMessages().isEmpty()) {
                for (String message : result.getMessages()) {
                    System.out.println("- " + message);
                }
            } else {
                System.out.println("- No messages.");
            }

        } catch (Exception e) {
            System.err.println("========================================");
            System.err.println("Seed process failed.");
            System.err.println("========================================");
            e.printStackTrace();
        } finally {
            if (context != null) {
                context.close();
            }
        }
    }
}
