import pandas as pd
import numpy as np

# 100 Professions ki list categories ke sath
professions = [
    # Technology & Engineering (15)
    "Software Engineer", "Data Scientist", "Cybersecurity Analyst", "AI Researcher", "Cloud Architect",
    "Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Aerospace Engineer", "Robotics Engineer",
    "Network Engineer", "DevOps Specialist", "UX/UI Designer", "Game Developer", "Systems Architect",
    # Medical & Healthcare (15)
    "Surgeon", "Nurse", "Pharmacist", "Dentist", "Physiotherapist", "Psychiatrist", "Veterinary Doctor",
    "Radiologist", "Nutritionist", "Medical Lab Technician", "Anesthesiologist", "Cardiologist", "Pediatrician",
    "Occupational Therapist", "Optometrist",
    # Business, Finance & Law (15)
    "Chartered Accountant", "Investment Banker", "Corporate Lawyer", "Human Resources Manager", "Marketing Manager",
    "Financial Analyst", "Project Manager", "Economist", "Auditor", "Business Consultant", "Sales Director",
    "Supply Chain Manager", "Real Estate Agent", "Risk Manager", "Actuary",
    # Arts, Design & Media (15)
    "Graphic Designer", "Architect", "Interior Designer", "Fashion Designer", "Animator", "Photographer",
    "Film Director", "Journalist", "Content Writer", "Art Curator", "Musician", "Actor", "Copywriter",
    "Video Editor", "Makeup Artist",
    # Science & Education (15)
    "Astrophysicist", "Marine Biologist", "Biochemist", "Professor", "School Teacher", "Archaeologist",
    "Historian", "Geologist", "Mathematician", "Sociologist", "Environmental Scientist", "Forensic Scientist",
    "Librarian", "Education Consultant", "Geneticist",
    # Services & Others (15)
    "Chef", "Pilot", "Flight Attendant", "Police Officer", "Army Officer", "Social Worker", "Event Planner",
    "Travel Guide", "Fitness Trainer", "Firefighter", "Detective", "Diplomat", "Politician", "Farmer", "Electrician",
    # Specialized Niches (10)
    "Astronomer", "Wildlife Photographer", "Sound Engineer", "Translator", "Athlete", "Yoga Instructor",
    "Blogger", "Nanny", "Carpenter", "Tailor"
]

def generate_logical_scores(job):
    # Default scores (Baseline)
    scores = {
        "O_score": np.round(np.random.uniform(5, 9), 2),
        "C_score": np.round(np.random.uniform(5, 9), 2),
        "E_score": np.round(np.random.uniform(4, 8), 2),
        "A_score": np.round(np.random.uniform(4, 8), 2),
        "N_score": np.round(np.random.uniform(3, 6), 2),
        "Numerical Aptitude": np.round(np.random.uniform(4, 8), 2),
        "Spatial Aptitude": np.round(np.random.uniform(4, 8), 2),
        "Perceptual Aptitude": np.round(np.random.uniform(4, 8), 2),
        "Abstract Reasoning": np.round(np.random.uniform(5, 9), 2),
        "Verbal Reasoning": np.round(np.random.uniform(4, 8), 2)
    }

    # Logic Adjustment based on Profession Type
    if any(tech in job for tech in ["Engineer", "Data", "AI", "Math", "Architect"]):
        scores["Numerical Aptitude"] = np.round(np.random.uniform(8.5, 9.9), 2)
        scores["Abstract Reasoning"] = np.round(np.random.uniform(8.0, 9.9), 2)
    
    if any(med in job for med in ["Surgeon", "Doctor", "Nurse", "Therapist", "Psychiatrist"]):
        scores["A_score"] = np.round(np.random.uniform(8.0, 9.8), 2)
        scores["Verbal Reasoning"] = np.round(np.random.uniform(7.5, 9.5), 2)
        scores["C_score"] = np.round(np.random.uniform(8.5, 9.9), 2)

    if any(art in job for art in ["Designer", "Artist", "Animator", "Fashion", "Musician"]):
        scores["O_score"] = np.round(np.random.uniform(8.5, 9.9), 2)
        scores["Spatial Aptitude"] = np.round(np.random.uniform(8.0, 9.9), 2)

    if any(biz in job for biz in ["Manager", "Sales", "Lawyer", "Director", "Agent"]):
        scores["E_score"] = np.round(np.random.uniform(8.0, 9.9), 2)
        scores["Verbal Reasoning"] = np.round(np.random.uniform(8.0, 9.8), 2)

    return scores

# Har profession ke liye 10-10 rows generate karte hain (Total 1000 rows)
data_list = []
for job in professions:
    for _ in range(10): 
        row = generate_logical_scores(job)
        row["Career"] = job
        data_list.append(row)

df = pd.DataFrame(data_list)

# CSV file save karein
df.to_csv("expanded_career_dataset.csv", index=False)
print("Dataset generated successfully with 100 professions and 1000 rows!")