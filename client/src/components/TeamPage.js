import React, { useState, useEffect } from "react";
import API from "../api"; // API 인스턴스 import
import "./TeamPage.css";

function TeamPage() {
  const [teamInfo, setTeamInfo] = useState(null);

  useEffect(() => {
    // Spring Boot API에서 팀 정보 가져오기
    API.get("/team") // 팀 정보를 제공하는 Spring Boot API 엔드포인트
      .then((response) => {
        setTeamInfo(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch team information:", error);
      });
  }, []);

  return (
    <div className="team-page-container">
      <h1>Team Introduction</h1>
      {teamInfo ? (
        <div>
          <h2>{teamInfo.name}</h2>
          <p>{teamInfo.description}</p>
          <ul>
            {teamInfo.members.map((member) => (
              <li key={member.id}>
                {member.name} - {member.role}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading team information...</p>
      )}
    </div>
  );
}

export default TeamPage;
