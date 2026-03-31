export interface Env {
  AI: Ai;
  ELEVENLABS_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/generate" && request.method === "POST") {
      try {
        const { genre, ageGroup, opening, voiceId } = await request.json<{
          genre: string;
          ageGroup: string;
          opening: string;
          voiceId: string;
        }>();

        if (!genre || !ageGroup || !opening || !voiceId) {
          return Response.json(
            { error: "genre, ageGroup, opening, and voiceId are required" },
            { status: 400 }
          );
        }

        const ageGuidance: Record<string, string> = {
          "2-5":
            "The audience is toddlers and very young children (ages 2-5). Use very simple words, short sentences, gentle tone, and playful repetition. Keep the story to about 80-100 words. Nothing scary.",
          "5-12":
            "The audience is children (ages 5-12). Use vivid descriptions, light humor, and a sense of adventure. Keep the story to about 150-200 words. Keep it family-friendly.",
          "12-18":
            "The audience is teenagers (ages 12-18). The story can be more nuanced with interesting themes, but keep it clean. About 150-200 words.",
          "18+":
            "The audience is adults (18+). The story can be sophisticated and thought-provoking, but keep it clean and appropriate. About 150-200 words. No explicit content.",
        };

        const agePrompt = ageGuidance[ageGroup] || ageGuidance["5-12"];

        // Generate story with Workers AI
        const aiResponse = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
          {
            messages: [
              {
                role: "system",
                content: `You are a bedtime story narrator. The user gives you a genre and an opening for a story. Continue their story in that genre. ${agePrompt} End the story with a short moral or lesson on its own line, starting with "Moral:". STRICT RULES: Never produce sexual, violent, gory, or inappropriate content. Do not include titles, headings, or meta-commentary. Just the story followed by the moral.`,
              },
              {
                role: "user",
                content: `Genre: ${genre}\n\nStory beginning: ${opening}`,
              },
            ],
          }
        );

        const story = (aiResponse as { response: string }).response;

        if (!story) {
          return Response.json(
            { error: "Failed to generate story" },
            { status: 500 }
          );
        }

        // Generate audio with ElevenLabs TTS
        const ttsResponse = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
          {
            method: "POST",
            headers: {
              "xi-api-key": env.ELEVENLABS_API_KEY,
              "Content-Type": "application/json",
              Accept: "audio/mpeg",
            },
            body: JSON.stringify({
              text: story,
              model_id: "eleven_multilingual_v2",
            }),
          }
        );

        if (!ttsResponse.ok) {
          const errText = await ttsResponse.text();
          return Response.json(
            {
              error: `ElevenLabs API error: ${ttsResponse.status} ${errText}`,
            },
            { status: 502 }
          );
        }

        const audioBuffer = await ttsResponse.arrayBuffer();
        const audioBase64 = btoa(
          new Uint8Array(audioBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        return Response.json({ story, audio: audioBase64 });
      } catch (err: any) {
        return Response.json(
          { error: err.message || "Internal error" },
          { status: 500 }
        );
      }
    }

    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
