import pandas as pd
import json
import os

def excel_to_json(excel_file):
    # Lire le fichier Excel
    excel = pd.ExcelFile(excel_file)
    
    # Dictionnaire pour stocker les données
    data = {}
    
    # Parcourir chaque onglet
    for sheet_name in excel.sheet_names:
        df = pd.read_excel(excel, sheet_name)
        
        if 'Sous-thème' in df.columns and 'Chapitre' in df.columns and 'Sujet' in df.columns and 'Réponse' in df.columns:
            for _, row in df.iterrows():
                # Extraire les valeurs avec des valeurs par défaut si nécessaire
                subtheme = str(row['Sous-thème']).strip() if pd.notna(row['Sous-thème']) else "Sans sous-thème"
                chapter = str(row['Chapitre']).strip() if pd.notna(row['Chapitre']) else "Sans chapitre"
                question = str(row['Sujet']).strip() if pd.notna(row['Sujet']) else "Divers"
                answer = str(row['Réponse']).strip() if pd.notna(row['Réponse']) else "Pas de réponse fournie"
                
                # Initialiser les niveaux hiérarchiques dans le dictionnaire
                if sheet_name not in data:
                    data[sheet_name] = {}
                if subtheme not in data[sheet_name]:
                    data[sheet_name][subtheme] = {}
                if chapter not in data[sheet_name][subtheme]:
                    data[sheet_name][subtheme][chapter] = []
                
                # Ajouter la question et la réponse
                data[sheet_name][subtheme][chapter].append({
                    'question': question,
                    'answer': answer
                })
    
    # Créer le dossier public s'il n'existe pas
    os.makedirs('public', exist_ok=True)
    
    # Sauvegarder dans deux fichiers
    with open('qa_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    with open('public/qa_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return data

if __name__ == "__main__":
    excel_file = "data/FAQ_EXFSRI_2024.xlsx"
    data = excel_to_json(excel_file)
    print(f"Conversion terminée. Données sauvegardées dans 'qa_data.json' et 'public/qa_data.json'")
