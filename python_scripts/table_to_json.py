
import pandas as pd
import json

json_output = {}


def parse_to_json(df):
    global json_output
    for index, row in df.iterrows():
        json_output[row['DiseaseName']] = str(row['# GeneSymbol']).split(',')


if __name__ == '__main__':
    file_path = "C:/Users/nivri/Coding_Projects/Eyal Hadad Project/codes/graph/python_scripts/diseases_prots_table100.csv"
    df = pd.read_csv(file_path)
    parse_to_json(df)
    with open('json_output.json', "w") as write_file:
        json.dump(json_output, write_file)
    print('end')


    # user_secltion_disease
    # proteins = json_File[user_secltion_disease] 
    # for each prot in user selection:
    #     dict[user_secltion_disease] = prot
