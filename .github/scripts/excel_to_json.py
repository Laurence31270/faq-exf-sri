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
        
        if 'Sujets' in df.columns and 'Observations' in df.columns:
            qa_list = []
            for _, row in df.iterrows():
                if pd.notna(row['Sujets']) and pd.notna(row['Observations']):
                    qa_list.append({
                        'question': str(row['Sujets']).strip(),
                        'answer': str(row['Observations']).strip()
                    })
            
            if qa_list:
                data[sheet_name] = qa_list
    
    # Créer le dossier public s'il n'existe pas
    os.makedirs('public', exist_ok=True)
    
    # Sauvegarder dans public/
    with open('qa_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    # Aussi sauvegarder dans dist/ si le dossier existe
    if os.path.exists('dist'):
        with open('dist/qa_data.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    return data

if __name__ == "__main__":
    excel_file = "data/FAQ_EXFSRI_2024.xlsx"
    data = excel_to_json(excel_file)
    print(f"Conversion terminée. Données sauvegardées dans 'qa_data.json' et 'dist/qa_data.json'")