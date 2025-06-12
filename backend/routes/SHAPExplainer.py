import pandas as pd
import shap
import matplotlib.pyplot as plt
import numpy as np

def save_shap_plot(pipeline, input_vector, patient_id, background_data_path='./shap_background.csv'):
    # Load background data
    background_data = pd.read_csv(background_data_path)

    scaler = pipeline.named_steps['scaler']
    classifier = pipeline.named_steps['classifier']

    input_array = np.array(input_vector).reshape(1, -1)
    input_scaled = scaler.transform(input_array)
    background_scaled = scaler.transform(background_data)

    explainer = shap.Explainer(classifier, background_scaled, feature_names=background_data.columns)
    shap_values = explainer(input_scaled)

    save_path = f'./shap_plots/shap_plot_{patient_id}.png'

    shap.plots.waterfall(shap_values[0], show=False)
    fig = plt.gcf()
    fig.set_size_inches(8, 5)
    fig.savefig(save_path, bbox_inches="tight", dpi=80)
    plt.close(fig)

    return save_path