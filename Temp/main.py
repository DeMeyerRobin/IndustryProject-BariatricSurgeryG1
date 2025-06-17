import gradio as gr

# Store responses and track current question
responses = {}
questions = [
    "What is your age?",
    "What is your blood pressure? (e.g., 120/80)",
    "What is your weight in kg?",
    "What is your height in cm?",
    "Do you have any allergies? (Yes/No)",
    "Are you currently taking any medications? (Yes/No)"
]

def process_response(answer, current_question_idx):
    # Store the current answer
    if current_question_idx < len(questions):
        question_key = f"question_{current_question_idx + 1}"
        responses[question_key] = answer
    
    # Move to next question
    next_idx = current_question_idx + 1
    
    if next_idx < len(questions):
        # Still have questions to ask
        next_question = questions[next_idx]
        return next_question, "", next_idx, gr.update(visible=False)
    else:
        # All questions completed - show summary
        summary = "Thank you! Here's a summary of your responses:\n\n"
        for i, (key, value) in enumerate(responses.items()):
            summary += f"{questions[i]}: {value}\n"
        
        return summary, "", next_idx, gr.update(visible=True, value="Start Over")

def reset_form():
    global responses
    responses = {}
    return questions[0], "", 0, gr.update(visible=False)

# Create the Gradio interface
with gr.Blocks(title="Health Information Form") as demo:
    gr.Markdown("# Health Information Questionnaire")
    gr.Markdown("Please answer each question and press Enter or click Submit to continue.")
    
    # State to track current question index
    question_idx = gr.State(0)
    
    # Question display
    question_display = gr.Textbox(
        label="Question",
        value=questions[0],
        interactive=False,
        lines=2
    )
    
    # Answer input
    answer_input = gr.Textbox(
        label="Your Answer",
        placeholder="Type your answer here...",
        lines=1
    )
    
    # Submit button
    submit_btn = gr.Button("Submit", variant="primary")
    
    # Reset button (initially hidden)
    reset_btn = gr.Button("Start Over", visible=False)
    
    # Handle submission
    submit_btn.click(
        fn=process_response,
        inputs=[answer_input, question_idx],
        outputs=[question_display, answer_input, question_idx, reset_btn]
    )
    
    # Handle Enter key in text input
    answer_input.submit(
        fn=process_response,
        inputs=[answer_input, question_idx],
        outputs=[question_display, answer_input, question_idx, reset_btn]
    )
    
    # Handle reset
    reset_btn.click(
        fn=reset_form,
        outputs=[question_display, answer_input, question_idx, reset_btn]
    )

if __name__ == "__main__":
    demo.launch()