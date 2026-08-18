package com.rootpilot.rootpilot_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RootpilotBackendApplication {

	public static void main(String[] args) {

		java.util.TimeZone.setDefault(java.util.TimeZone.getTimeZone("UTC"));
		System.out.println("TIMEZONE = " +
				java.util.TimeZone.getDefault().getID());

		SpringApplication.run(RootpilotBackendApplication.class, args);
	}

}