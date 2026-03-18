import pandas as pd
import json

def analyze_excel(file_path):
    try:
        # Read the first few rows to get an idea of the structure
        df = pd.read_excel(file_path, nrows=20)
        
        info = {
            "columns": list(df.columns),
            "sample_data": df.head(5).to_dict(orient='records'),
            "summary": df.describe(include='all').to_dict()
        }
        
        with open('planilha_analise.json', 'w', encoding='utf-8') as f:
            json.dump(info, f, ensure_ascii=False, indent=4, default=str)
            
        print("Análise concluída com sucesso. Resultados em planilha_analise.json")
    except Exception as e:
        print(f"Erro ao analisar planilha: {e}")

if __name__ == "__main__":
    analyze_excel('MODELO BD DI ULTIMA ATUALIZACAO (2).xlsx')
