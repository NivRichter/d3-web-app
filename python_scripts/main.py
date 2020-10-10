import pandas as pd
import json

diseases_n_protein_name = pd.DataFrame(columns=['DiseaseName', '# GeneSymbol'])
# protein_n_drugs = {}
#protein_data = pd.read_csv("C:/Users/Barak/PycharmProjects/pandasPractice/drug_gene_proteins.csv")
protein_data = pd.read_csv("C:/Users/nivri/Coding_Projects/Eyal Hadad Project/codes/graph/python_scripts/drug_gene_proteins.csv").drop( ['drug_id', 'protein_name', 'drug_name'], axis=1)

def process(chunk, i):
    global diseases_n_protein_name
    # global protein_n_drugs
    # merge the two tables and drop some useless columns
    merged_tables = pd.merge(protein_data, chunk, left_on=["gene_name"], right_on=["# GeneSymbol"], how='inner')
    #merged_tables = merged_tables.drop(['InferenceScore', 'PubMedIDs', 'OmimIDs', 'InferenceChemicalName',
    #                                    'DirectEvidence', 'DiseaseID', 'GeneID', 'drug_id', 'gene_name', 'protein_name', 'drug_name'], axis=1)
    merged_tables = merged_tables.drop([ 'gene_name'], axis=1)
    print(len(diseases_n_protein_name.index))
    diseases_n_protein_name = pd.concat([diseases_n_protein_name, merged_tables], sort=False).drop_duplicates()

    diseases_n_protein_name['# GeneSymbol'] = diseases_n_protein_name.groupby('DiseaseName')['# GeneSymbol'].transform(lambda x:','.join(x))
    del merged_tables
    if i%100 == 0:
        diseases_n_protein_name.to_csv("diseases_prots_table" + str(i) + ".csv")
   # print(len(diseases_n_protein_name.index))
    # make diseases a set with every disease name, and make each disease show only once.
    # diseases = pd.unique(merged_tables['DiseaseName'])
    # proteind_drugs_df = protein_data

    #
    # # make a JSON for each disease and it's proteins.
    # for d in diseases:  # creates a json {disease:[protein,...], disease:[protein,...],...}
    #     d_subtable = merged_tables.loc[merged_tables['DiseaseName'] == d]
    #     if d in diseases_n_protein_name:
    #         diseases_n_protein_name[d] = diseases_n_protein_name[d].union(set(d_subtable['# GeneSymbol'].tolist()))
    #     else:
    #         diseases_n_protein_name[d] = set(d_subtable['# GeneSymbol'].tolist())
    #     #print(type(diseases_n_protein_name[d]))
    #
    # # make a JSON for each protein and it's drugs that affect it.
    # for d in diseases_n_protein_name:   # creates a json {protein: [drug,...], protein: [drug,...], ...}
    #     for protein in diseases_n_protein_name[d]:
    #         if protein in protein_n_drugs:
    #             protein_n_drugs[protein] = protein_n_drugs[protein].union(set((proteind_drugs_df.loc[proteind_drugs_df['gene_name']==protein]['drug_name'] ).tolist()))
    #         else:
    #             protein_n_drugs[protein] = set(proteind_drugs_df.loc[proteind_drugs_df['gene_name']==protein]['drug_name'].tolist())
    #             #print(type(protein_n_drugs[protein]))


    # print('diseases_n_protein_name:\n')
    # print(diseases_n_protein_name)
    #
    # print('protein_n_drugs:\n' )
    # print(protein_n_drugs)


if __name__ == '__main__':
    #file_path = 'C:/Users/Barak/Desktop/Project/CTD_genes_diseases.csv'
    file_path = 'C:/Users/nivri/OneDrive/Documents/CTD_genes_diseases.csv'

    chunksize = 10 ** 4
    i = 0
    # read the large dataset in chunks
    for chunk in pd.read_csv(file_path, skiprows=27,
                             header=0, chunksize=chunksize , dtype ={'# GeneSymbol':'str',	'GeneID':'str',	'DiseaseName':'str',
                                                                     'DiseaseID':'str',	'DirectEvidence':'str',	'InferenceChemicalName':'str',	'InferenceScore':'str','OmimIDs':'str',	'PubMedIDs':'str'} , names=['# GeneSymbol',	'GeneID',	'DiseaseName',	'DiseaseID',	'DirectEvidence',	'InferenceChemicalName',	'InferenceScore'	,'OmimIDs',	'PubMedIDs'] ):
        chunk = chunk.drop(['InferenceScore', 'PubMedIDs', 'OmimIDs', 'InferenceChemicalName',
                                        'DirectEvidence', 'DiseaseID', 'GeneID'], axis=1)
        process(chunk, i)
        del(chunk)
        print(i)
        # if i == 3:
        #     break
        i = i+1
    final = pd.concat([diseases_n_protein_name, diseases_n_protein_name]).drop_duplicates()
    final.to_csv("checkMerge.csv")
    # # make both dictionarys lists for JSON
    # for disease in diseases_n_protein_name:
    #     diseases_n_protein_name[disease] = list(diseases_n_protein_name[disease])
    # for protein in protein_n_drugs:
    #     protein_n_drugs[protein] = list(protein_n_drugs[protein])
    # # crate 2 JSONs
    # with open("protein_n_drugs.json", "w") as write_file:
    #     json.dump(protein_n_drugs, write_file)
    # with open("diseases_n_protein_name.json", "w") as write_file:
    #     json.dump(diseases_n_protein_name, write_file)
    # print('end')
