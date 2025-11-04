const ImageFactory = require('../../../../.claude/skills/image-factory/scripts/index.js');
const path = require('path');
const fs = require('fs-extra');

async function generateStrategySprintImages() {
    const factory = new ImageFactory();
    const targetDir = 'D:\\Users\\scale\\Code\\revealX\\content\\courses\\business_agility\\assets\\images';

    // Ensure target directory exists
    await fs.ensureDir(targetDir);

    const images = [
        {
            name: 'team-collaboration-modern-office.png',
            prompt: 'Modern office with diverse team of business professionals collaborating around a large whiteboard, natural lighting, professional setting',
            style: 'photorealistic'
        },
        {
            name: 'strategy-workshop-planning.png',
            prompt: 'Business professionals in modern workshop setting with colorful sticky notes on glass walls, brainstorming session, creative workspace',
            style: 'photorealistic'
        },
        {
            name: 'team-discussion-ideas.png',
            prompt: 'Small team of professionals discussing ideas with laptops and documents on table, engaged conversation, modern meeting room',
            style: 'photorealistic'
        },
        {
            name: 'brainstorming-session.png',
            prompt: 'Dynamic team brainstorming session with visual boards, markers, and creative materials, energetic collaboration, bright workspace',
            style: 'photorealistic'
        },
        {
            name: 'workshop-break-collaboration.png',
            prompt: 'Professionals collaborating casually during coffee break, relaxed networking, modern office lounge area with natural light',
            style: 'photorealistic'
        },
        {
            name: 'customer-research-team.png',
            prompt: 'Business team analyzing customer research data on computer screens and charts, data visualization, focused analysis session',
            style: 'photorealistic'
        },
        {
            name: 'positioning-strategy-meeting.png',
            prompt: 'Team creating positioning matrix on large whiteboard with quadrants and sticky notes, strategic planning session',
            style: 'photorealistic'
        },
        {
            name: 'sprint-planning-team.png',
            prompt: 'Agile team planning sprints with timeline visible on wall board, scrum planning, organized project management workspace',
            style: 'photorealistic'
        }
    ];

    console.log(`\n📸 Generating ${images.length} images for Strategy Sprint Workshop...\n`);

    const results = [];

    for (const img of images) {
        try {
            console.log(`\nGenerating: ${img.name}`);
            console.log(`Prompt: ${img.prompt}`);

            const result = await factory.generateImage(img.prompt, img.style, '16:9');

            if (result.cached) {
                console.log(`✅ Retrieved from cache`);
            } else {
                console.log(`✨ Generated new image`);
            }

            // Copy to target directory
            const targetPath = path.join(targetDir, img.name);
            await fs.copy(result.localPath, targetPath);

            console.log(`📁 Saved to: ${targetPath}`);

            results.push({
                name: img.name,
                path: targetPath,
                cached: result.cached,
                prompt: result.revisedPrompt || img.prompt
            });

        } catch (error) {
            console.error(`❌ Error generating ${img.name}:`, error.message);
        }
    }

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('\n📊 GENERATION SUMMARY\n');
    console.log(`Total images generated: ${results.length}/${images.length}`);
    console.log(`Cached images used: ${results.filter(r => r.cached).length}`);
    console.log(`New images created: ${results.filter(r => !r.cached).length}`);

    console.log('\n📁 Generated Images:\n');
    results.forEach(r => {
        console.log(`  • ${r.name}`);
        console.log(`    Path: ${r.path}`);
        console.log(`    ${r.cached ? '(from cache)' : '(newly generated)'}`);
    });

    console.log('\n✅ Strategy Sprint Workshop images ready!\n');
    console.log('='.repeat(80));

    return results;
}

// Run the generation
generateStrategySprintImages().catch(console.error);