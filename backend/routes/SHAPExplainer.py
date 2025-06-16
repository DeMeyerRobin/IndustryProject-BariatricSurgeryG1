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

    def shap_contribution_percent(shap_val, base_log_odds):
        """Convert SHAP value from log-odds to percent probability increase."""
        prob_before = 1 / (1 + np.exp(-base_log_odds))
        prob_after = 1 / (1 + np.exp(-(base_log_odds + shap_val)))
        return (prob_after - prob_before) * 100  # in percent

    # Load and scale data
    background_data = pd.read_csv(background_data_path)
    scaler = pipeline.named_steps['scaler']
    classifier = pipeline.named_steps['classifier']

    input_array = np.array(input_vector).reshape(1, -1)
    input_scaled = scaler.transform(input_array)
    background_scaled = scaler.transform(background_data)

    # Compute SHAP values
    explainer = shap.Explainer(classifier, background_scaled, feature_names=background_data.columns)
    shap_values = explainer(input_scaled)

    shap_vals = shap_values.values[0]
    features = shap_values.feature_names
    input_data = shap_values.data[0]
    base_log_odds = shap_values.base_values[0]

    # Convert SHAP values to % increase in probability
    feature_impact = [
        (feature, shap_contribution_percent(val, base_log_odds))
        for feature, val in zip(features, shap_vals)
        if val > 0
    ]

    # Sort descending by impact
    feature_impact.sort(key=lambda x: x[1], reverse=True)

    # Create filtered SHAP object for plotting
    shap_values_filtered = shap.Explanation(
        values=np.where(shap_vals > 0, shap_vals, 0),
        base_values=base_log_odds,
        data=input_data,
        feature_names=features
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

    return save_path, feature_impact


def save_shap_plot_negative_only(pipeline, input_vector, patient_id, background_data_path='./shap_background.csv'):
    import pandas as pd
    import shap
    import matplotlib.pyplot as plt
    import numpy as np
    import os
    import uuid
    import glob

    def shap_contribution_percent(shap_val, base_log_odds):
        """Convert SHAP value from log-odds to percent probability change."""
        prob_before = 1 / (1 + np.exp(-base_log_odds))
        prob_after = 1 / (1 + np.exp(-(base_log_odds + shap_val)))
        return (prob_after - prob_before) * 100  # in percent

    # Load and scale data
    background_data = pd.read_csv(background_data_path)
    scaler = pipeline.named_steps['scaler']
    classifier = pipeline.named_steps['classifier']

    input_array = np.array(input_vector).reshape(1, -1)
    input_scaled = scaler.transform(input_array)
    background_scaled = scaler.transform(background_data)

    # Compute SHAP values
    explainer = shap.Explainer(classifier, background_scaled, feature_names=background_data.columns)
    shap_values = explainer(input_scaled)

    shap_vals = shap_values.values[0]
    features = shap_values.feature_names
    input_data = shap_values.data[0]
    base_log_odds = shap_values.base_values[0]

    # Convert SHAP values to % decrease in probability
    feature_impact = [
        (feature, shap_contribution_percent(val, base_log_odds))
        for feature, val in zip(features, shap_vals)
        if val < 0
    ]

    # Sort ascending by impact (more negative = stronger decrease)
    feature_impact.sort(key=lambda x: x[1])

    # Create filtered SHAP object for plotting
    shap_values_filtered = shap.Explanation(
        values=np.where(shap_vals < 0, shap_vals, 0),
        base_values=base_log_odds,
        data=input_data,
        feature_names=features
    )

    # Delete old plots
    os.makedirs("shap_plots", exist_ok=True)
    for f in glob.glob(f'./shap_plots/patient_{patient_id}_*_negative.png'):
        os.remove(f)

    unique_id = uuid.uuid4().hex[:8]
    save_path = f'./shap_plots/patient_{patient_id}_{unique_id}_negative.png'

    shap.plots.waterfall(shap_values_filtered, show=False)
    fig = plt.gcf()
    fig.set_size_inches(8, 5)
    fig.savefig(save_path, bbox_inches="tight", dpi=80)
    plt.close(fig)

    return save_path, feature_impact