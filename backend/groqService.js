const Groq = require('groq-sdk');

class GroqService {
    constructor(apiKey) {
        this.client = new Groq({ apiKey });
    }

    async getDefinition(word) {
        try {
            const completion = await this.client.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a technical dictionary. Provide concise, accurate definitions for technical terms. Format: Just the definition, no extra text.'
                    },
                    {
                        role: 'user',
                        content: `Define the term: ${word}`
                    }
                ],
                model: 'mixtral-8x7b-32768',
                temperature: 0.3,
                max_tokens: 200
            });

            return completion.choices[0]?.message?.content || 'Definition not available';
        } catch (error) {
            console.error('Groq API error:', error);
            return null;
        }
    }

    async simplifyDefinition(word, definition) {
        try {
            const completion = await this.client.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful teacher who explains complex technical concepts in simple terms that anyone can understand. Use analogies and everyday language.'
                    },
                    {
                        role: 'user',
                        content: `Explain "${word}" in simple terms. Technical definition: ${definition}`
                    }
                ],
                model: 'mixtral-8x7b-32768',
                temperature: 0.7,
                max_tokens: 300
            });

            return completion.choices[0]?.message?.content || definition;
        } catch (error) {
            console.error('Groq API error:', error);
            return definition;
        }
    }

    async correctSpelling(word) {
        try {
            const completion = await this.client.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a spell checker for technical terms. Return only the corrected spelling, nothing else. If the word is correct, return it as-is.'
                    },
                    {
                        role: 'user',
                        content: `Correct the spelling: ${word}`
                    }
                ],
                model: 'mixtral-8x7b-32768',
                temperature: 0.1,
                max_tokens: 50
            });

            return completion.choices[0]?.message?.content?.trim() || word;
        } catch (error) {
            console.error('Groq API error:', error);
            return word;
        }
    }

    async generateQuiz(words, count = 5) {
        try {
            const wordList = words.slice(0, 10).join(', ');
            const completion = await this.client.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a quiz generator. Create multiple choice questions about technical terms. Return ONLY valid JSON with this exact structure:
{
  "questions": [
    {
      "question": "What is X?",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0
    }
  ]
}
The correctAnswer is the index (0-3) of the correct option.`
                    },
                    {
                        role: 'user',
                        content: `Generate ${count} multiple choice questions about these technical terms: ${wordList}`
                    }
                ],
                model: 'mixtral-8x7b-32768',
                temperature: 0.7,
                max_tokens: 1500
            });

            const content = completion.choices[0]?.message?.content;
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return { questions: [] };
        } catch (error) {
            console.error('Groq API error:', error);
            return { questions: [] };
        }
    }
}

module.exports = GroqService;
