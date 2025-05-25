import random
import json

sources = [
    "Clinical Trial Database",
    "Adverse Event Report",
    "Patient Record",
    "Drug Information",
    "Lab Results",
    "Protocol Document",
    "Research Paper",
]
texts = [
    "Patient enrolled in clinical trial NCT123456.",
    "Adverse event reported: mild headache after dose 2.",
    "Lab result: Hemoglobin 13.2 g/dL, normal range.",
    "Protocol amendment approved for study ABC-789.",
    "Drug X showed improved efficacy in phase 2.",
    "Patient discontinued due to adverse event.",
    "Research paper: Efficacy of Drug Y in oncology.",
]


def random_vector(dim=768):
    return [round(random.uniform(0, 1), 4) for _ in range(dim)]


points = []
for i in range(1, 501):  # 500 points
    text = random.choice(texts)
    source = random.choice(sources)
    score = round(random.uniform(0.7, 1.0), 2)
    size = len(text.split())  # word count as a proxy for tokens
    points.append(
        {
            "id": i,
            "vector": random_vector(),
            "payload": {"text": text, "source": source, "score": score, "size": size},
        }
    )

with open("roche_points.json", "w") as f:
    json.dump({"points": points}, f, indent=2)
