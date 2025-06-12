import pandas as pd
import shap
import matplotlib.pyplot as plt
import numpy as np
import os
import uuid
import glob

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

    # Delete any previous plots for this patient
    os.makedirs("shap_plots", exist_ok=True)
    for f in glob.glob(f'./shap_plots/patient_{patient_id}_*.png'):
        os.remove(f)

    # Generate a unique filename
    unique_id = uuid.uuid4().hex[:8]
    save_path = f'./shap_plots/patient_{patient_id}_{unique_id}.png'

    # Save plot
    shap.plots.waterfall(shap_values[0], show=False)
    fig = plt.gcf()
    fig.set_size_inches(8, 5)
    fig.savefig(save_path, bbox_inches="tight", dpi=80)
    plt.close(fig)

    return save_path


from shap import Explanation

def save_shap_plot_positive_only(pipeline, input_vector, patient_id, background_data_path='./shap_background.csv'):
    import pandas as pd
    import shap
    import matplotlib.pyplot as plt
    import numpy as np
    import os
    import uuid
    import glob

    background_data = pd.read_csv(background_data_path)
    scaler = pipeline.named_steps['scaler']
    classifier = pipeline.named_steps['classifier']

    input_array = np.array(input_vector).reshape(1, -1)
    input_scaled = scaler.transform(input_array)
    background_scaled = scaler.transform(background_data)

    explainer = shap.Explainer(classifier, background_scaled, feature_names=background_data.columns)
    shap_values = explainer(input_scaled)

    # Only keep features that increase the prediction (positive SHAP values)
    shap_values_filtered = shap.Explanation(
        values = np.where(shap_values.values[0] > 0, shap_values.values[0], 0),
        base_values = shap_values.base_values[0],
        data = shap_values.data[0],
        feature_names = shap_values.feature_names
    )

    # Delete old plots
    os.makedirs("shap_plots", exist_ok=True)
    for f in glob.glob(f'./shap_plots/patient_{patient_id}_*.png'):
        os.remove(f)

    unique_id = uuid.uuid4().hex[:8]
    save_path = f'./shap_plots/patient_{patient_id}_{unique_id}.png'

    shap.plots.waterfall(shap_values_filtered, show=False)
    fig = plt.gcf()
    fig.set_size_inches(8, 5)
    fig.savefig(save_path, bbox_inches="tight", dpi=80)
    plt.close(fig)

    return save_path