import pandas as pd
import json

def excel_to_json(excel_file):
    # Lire le fichier Excel
    excel = pd.ExcelFile(excel_file)
    
    # Dictionnaire pour stocker les données
    data = {}
    
    # Parcourir chaque onglet
    for sheet_name in excel.sheet_names:
        # Lire l'onglet
        df = pd.read_excel(excel, sheet_name)
        
        # Supposons que les colonnes s'appellent 'Sujets' et 'Observations'
        # Ajustez ces noms selon vos colonnes réelles
        if 'Sujets' in df.columns and 'Observations' in df.columns:
            # Convertir les données en liste de dictionnaires
            qa_list = []
            for _, row in df.iterrows():
                # Vérifier que la Sujets et la Observations ne sont pas vides
                if pd.notna(row['Sujets']) and pd.notna(row['Observations']):
                    qa_list.append({
                        'question': str(row['Sujets']).strip(),
                        'answer': str(row['Observations']).strip()
                    })
            
            # Ajouter au dictionnaire principal si on a des données
            if qa_list:
                data[sheet_name] = qa_list
    
    # Convertir en JSON
    with open('qa_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    return data

# Utilisation
if __name__ == "__main__":
    # Remplacez par le chemin de votre fichier Excel
    excel_file = "data/FAQ_EXFSRI_2024.xlsx"
    data = excel_to_json(excel_file)
    print(f"Conversion terminée. Données sauvegardées dans 'qa_data.json'")