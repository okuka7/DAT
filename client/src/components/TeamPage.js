import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTeamInfo } from "../slices/teamSlice"; // fetchTeamInfo 액션 import
import "./TeamPage.css";

function TeamPage() {
  const dispatch = useDispatch();
  const { teamInfo, loading, error } = useSelector((state) => state.team);

  useEffect(() => {
    dispatch(fetchTeamInfo());
  }, [dispatch]);

  return (
    <div className="team-page-container">
      <h1>Team Introduction</h1>
      {loading && <p>Loading team information...</p>}
      {error && <p>Error fetching team information: {error}</p>}
      {teamInfo && (
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
      )}
    </div>
  );
}

export default TeamPage;
