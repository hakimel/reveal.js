const ImageFactory = require('../../../../.claude/skills/image-factory/scripts/index.js');
const path = require('path');
const fs = require('fs-extra');

async function generateVisionStrategyImages() {
    const factory = new ImageFactory();
    const outputDir = path.join('D:', 'Users', 'scale', 'Code', 'revealX', 'content', 'courses', 'business_agility', 'assets', 'images');

    // Ensure output directory exists
    await fs.ensureDir(outputDir);

    console.log('🎨 Starting Vision and Strategy image generation...\n');
    console.log(`📁 Output directory: ${outputDir}\n`);

    const images = [
        // Photorealistic office/team collaboration scenes (8-10 images)
        {
            filename: 'vision-team-alignment.png',
            prompt: 'Diverse business team collaborating around a whiteboard with sticky notes and diagrams, natural office lighting, professional atmosphere',
            style: 'photorealistic',
            category: 'Team Collaboration'
        },
        {
            filename: 'strategic-planning-session.png',
            prompt: 'Modern conference room with team members engaged in strategic planning, large windows with city view, professional business setting',
            style: 'photorealistic',
            category: 'Team Collaboration'
        },
        {
            filename: 'team-workshop-activity.png',
            prompt: 'Small group of professionals working together on laptops and tablets in collaborative workspace, natural lighting, diverse team',
            style: 'photorealistic',
            category: 'Team Collaboration'
        },
        {
            filename: 'leadership-presentation.png',
            prompt: 'Business leader presenting vision to engaged team in modern office, professional presentation setup, attentive audience',
            style: 'photorealistic',
            category: 'Team Collaboration'
        },
        {
            filename: 'customer-research-session.png',
            prompt: 'Team reviewing customer feedback and data on large display screens, modern office environment, collaborative analysis',
            style: 'photorealistic',
            category: 'Team Collaboration'
        },
        {
            filename: 'innovation-brainstorm.png',
            prompt: 'Creative brainstorming session with diverse team, walls covered with ideas and sketches, energetic collaborative atmosphere',
            style: 'photorealistic',
            category: 'Team Collaboration'
        },
        {
            filename: 'remote-team-meeting.png',
            prompt: 'Professional video conference call displayed on large screen with participants engaged, modern office setup, hybrid work environment',
            style: 'photorealistic',
            category: 'Team Collaboration'
        },
        {
            filename: 'agile-standup-meeting.png',
            prompt: 'Team standing around scrum board in modern office, sticky notes visible, casual professional environment, morning standup',
            style: 'photorealistic',
            category: 'Team Collaboration'
        },
        {
            filename: 'executive-strategy-meeting.png',
            prompt: 'Senior executives discussing strategy around conference table, professional boardroom, documents and tablets visible',
            style: 'photorealistic',
            category: 'Team Collaboration'
        },
        {
            filename: 'team-celebration-success.png',
            prompt: 'Business team celebrating achievement with high-fives and smiles, modern office setting, positive energy and accomplishment',
            style: 'photorealistic',
            category: 'Team Collaboration'
        },

        // Concept images (4-6 images)
        {
            filename: 'vision-compass-concept.png',
            prompt: 'Abstract visualization of vision and direction, glowing compass on digital background, purple and yellow accents, inspirational',
            style: 'abstract',
            category: 'Concept'
        },
        {
            filename: 'customer-empathy-concept.png',
            prompt: 'Abstract representation of empathy and human connection, interconnected hearts and minds, warm colors, emotional intelligence',
            style: 'abstract',
            category: 'Concept'
        },
        {
            filename: 'strategic-clarity-concept.png',
            prompt: 'Abstract visualization of clarity and focus emerging from complexity, light breaking through fog, path forward illuminated',
            style: 'abstract',
            category: 'Concept'
        },
        {
            filename: 'innovation-lightbulb.png',
            prompt: 'Creative innovation concept with glowing lightbulb surrounded by flowing energy and ideas, purple and yellow tones, inspiration',
            style: 'abstract',
            category: 'Concept'
        },
        {
            filename: 'future-vision-concept.png',
            prompt: 'Abstract future-looking visualization with pathways and possibilities, hopeful and aspirational, modern design',
            style: 'abstract',
            category: 'Concept'
        },
        {
            filename: 'transformation-journey.png',
            prompt: 'Abstract journey from current state to future vision, path with milestones, transformation and growth theme',
            style: 'abstract',
            category: 'Concept'
        },

        // Tool/template visualizations (4-6 images)
        {
            filename: 'persona-map-template.png',
            prompt: 'Clean persona mapping template layout with sections for demographics, goals, pain points, professional business design',
            style: 'illustration',
            category: 'Tool'
        },
        {
            filename: 'empathy-map-canvas.png',
            prompt: 'Empathy map canvas with four quadrants for think, feel, say, do, clean professional design, business tool visualization',
            style: 'illustration',
            category: 'Tool'
        },
        {
            filename: 'customer-journey-map.png',
            prompt: 'Customer journey map template showing stages, touchpoints, and emotions over time, professional business design, clean layout',
            style: 'illustration',
            category: 'Tool'
        },
        {
            filename: 'value-proposition-canvas.png',
            prompt: 'Value proposition canvas with customer profile and value map sections, professional business tool design, clean modern style',
            style: 'illustration',
            category: 'Tool'
        },
        {
            filename: 'foundations-sprint-board.png',
            prompt: '2x2 differentiation matrix template with axes and quadrants, professional business strategy tool, clean design',
            style: 'illustration',
            category: 'Tool'
        },
        {
            filename: 'vision-framework-template.png',
            prompt: 'Vision crafting framework template with CRISP criteria sections, professional business planning tool, organized layout',
            style: 'illustration',
            category: 'Tool'
        }
    ];

    const results = [];
    let successCount = 0;
    let cacheHits = 0;

    for (let i = 0; i < images.length; i++) {
        const img = images[i];
        console.log(`\n[${i + 1}/${images.length}] Generating: ${img.filename}`);
        console.log(`📝 Category: ${img.category}`);
        console.log(`🎨 Style: ${img.style}`);
        console.log(`💬 Prompt: ${img.prompt.substring(0, 80)}...`);

        try {
            const result = await factory.generateImage(img.prompt, img.style, '16:9');

            // Copy to output directory with custom filename
            const destPath = path.join(outputDir, img.filename);
            await fs.copy(result.localPath, destPath, { overwrite: true });

            if (result.cached) {
                console.log(`✅ Retrieved from cache`);
                cacheHits++;
            } else {
                console.log(`✅ Generated successfully`);
            }
            console.log(`📁 Saved to: ${destPath}`);

            results.push({
                filename: img.filename,
                category: img.category,
                originalPrompt: img.prompt,
                revisedPrompt: result.revisedPrompt,
                cached: result.cached,
                path: destPath
            });

            successCount++;

        } catch (error) {
            console.error(`❌ Error generating ${img.filename}:`, error.message);
            results.push({
                filename: img.filename,
                category: img.category,
                error: error.message
            });
        }
    }

    // Generate summary report
    console.log('\n\n' + '='.repeat(80));
    console.log('📊 GENERATION SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Successfully generated: ${successCount}/${images.length} images`);
    console.log(`💾 Cache hits: ${cacheHits}`);
    console.log(`🆕 New generations: ${successCount - cacheHits}`);
    console.log(`📁 Output directory: ${outputDir}`);

    console.log('\n📋 Images by Category:');
    const categories = {};
    results.forEach(r => {
        if (!r.error) {
            categories[r.category] = (categories[r.category] || 0) + 1;
        }
    });
    Object.entries(categories).forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count} images`);
    });

    // Save detailed report
    const reportPath = path.join(outputDir, 'generation-report.json');
    await fs.writeJson(reportPath, {
        generatedAt: new Date().toISOString(),
        totalImages: images.length,
        successCount,
        cacheHits,
        newGenerations: successCount - cacheHits,
        outputDirectory: outputDir,
        results
    }, { spaces: 2 });

    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    console.log('\n✨ Image generation complete!\n');

    return results;
}

// Run the generation
generateVisionStrategyImages()
    .then(results => {
        console.log('🎉 All done!');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    });
