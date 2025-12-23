import json
import sys
import random

# --- AI GENERATION LOGIC ---
# This function simulates the structure and content a real AI would produce.
# To use a REAL AI (like Gemini), you would replace this function
# with an API call to the model and parse its response into this format.
def generate_slides_outline(topic, num_slides):
    topic = topic.strip().title()
    slides = []

    # 1. Title Slide
    slides.append({
        'title': topic,
        'subtitle': f'A Deep Dive into {topic}',
        'points': [f'Prepared by AI on {random.choice(["Digital Transformation", "Quantum Computing", "Sustainable Energy"])}', 'Key Takeaways and Future Scope']
    })

    # 2. Main Content Slides (automatically determine content)
    main_sections = [
        f'Introduction to {topic}',
        f'Core Principles of {topic}',
        f'Applications and Use Cases',
        f'Challenges and Solutions',
        f'Future Trends and Outlook'
    ]
    
    # Trim or extend sections to match the requested number of slides (num_slides - 2 for intro/conclusion)
    content_slides_needed = max(1, num_slides - 2)
    
    # Use the first 'content_slides_needed' sections
    sections = main_sections[:content_slides_needed]
    
    # If the user asked for more slides than available sections, we cycle
    while len(sections) < content_slides_needed:
        sections.append(f'Detailed Analysis of {topic} - Part {len(sections) - len(main_sections) + 2}')


    for i, section_title in enumerate(sections):
        points = [
            f'Point 1: Main concept related to {section_title.split(" of ")[-1]}',
            f'Point 2: Supporting evidence or data.',
            f'Point 3: Audience takeaway for this section.'
        ]
        slides.append({
            'title': section_title,
            'subtitle': f'Section {i+1} of {content_slides_needed}',
            'points': points
        })
    
    # 3. Conclusion Slide (only if more than 1 slide was requested)
    if num_slides > 1:
        slides.append({
            'title': 'Conclusion & Q&A',
            'subtitle': f'Summary of Key Insights on {topic}',
            'points': ['Summary of main topics.', 'Next Steps/Call to Action.']
        })

    return {'slides': slides[:num_slides]}

# --- MAIN EXECUTION ---
if __name__ == "__main__":
    # Expect the topic as the first argument and num_slides as the second
    if len(sys.argv) < 3:
        # If run without arguments, use a default topic
        topic = "AI Generated Presentation"
        num = 5
    else:
        topic = sys.argv[1]
        try:
            num = int(sys.argv[2])
        except ValueError:
            num = 5

    # Clamp the number of slides
    num = max(1, min(num, 15))

    # Generate the data
    generated_data = generate_slides_outline(topic, num)

    # Output the JSON
    print(json.dumps(generated_data, indent=2))