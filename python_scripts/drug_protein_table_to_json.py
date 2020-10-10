
import pandas as pd
import json

json_output = {}


def parse_to_json(df):
    global json_output
    for index, row in df.iterrows():
        json_output[row['gene_name']] = str(row['drug_name']).split(',')



if __name__ == '__main__':
    file_path = "C:/Users/nivri/Coding_Projects/Eyal Hadad Project/codes/graph/python_scripts/drug_gene_proteins.csv"
    df = pd.read_csv(file_path , header=0, dtype ={'drug_id':'str','drug_name':'str','gene_name':'str','protein_name':'str'},names =['drug_id','drug_name','gene_name','protein_name'])
    df = df.drop(['drug_id','protein_name'], axis=1).drop_duplicates()
    
    #df['drug_name']= df.groupby('gene_name')['drug_name'].transform(lambda x:','.join(x))
    df = df.groupby(['gene_name'])['drug_name'].apply(','.join).reset_index()


    parse_to_json(df)
    with open('json_drug_protein.json', "w") as write_file:
        json.dump(json_output, write_file)
    print('end')


    # user_secltion_disease
    # proteins = json_File[user_secltion_disease] 
    # for each prot in user selection:
    #     dict[user_secltion_disease] = prot
