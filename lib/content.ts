// Edit all personal copy, scene labels and music path here.
export const content = {
  title: "A Little Universe Called Nisha",
  name: "NISHA",
  musicPath: "/audio/nisha-ambience.mp3",
  intro: [
    "Somewhere in this huge universe…",
    "Among billions of people…",
    "I found someone who made everything feel different.",
  ],
  story: [
    { title: "Two separate worlds", text: "Two strangers, living their separate lives beneath the same sky.", kind: "apart" },
    { title: "One unexpected conversation", text: "A small hello that neither of us knew would become so much more.", kind: "talk" },
    { title: "Slowly becoming close", text: "Minutes became hours, and conversations became the best part of every day.", kind: "closer" },
    { title: "Finding comfort", text: "Somehow, your voice began to feel like the safest place I knew.", kind: "comfort" },
    { title: "Falling without realizing", text: "No grand moment—just a thousand little ones quietly turning into love.", kind: "falling" },
    { title: "My favourite person", text: "And suddenly, the person I wanted to tell everything to was you.", kind: "together" },
  ],
  petals: [
    "The way your smile changes my entire mood.",
    "The comfort I find in your voice.",
    "Your cute anger and all your little nakhre.",
    "The way you care, even when you don’t say it.",
    "How ordinary moments feel special with you.",
    "The peace of knowing that you are mine.",
  ],
  constellation: [
    { label: "The moon", message: "Because even from far away, you make my nights beautiful.", icon: "moon" },
    { label: "A flower", message: "Because your presence makes everything feel alive.", icon: "flower" },
    { label: "Music", message: "Because somehow every romantic song starts sounding like you.", icon: "music" },
    { label: "Home", message: "Because you feel less like a person and more like a safe place.", icon: "home" },
    { label: "Tomorrow", message: "Because you are present in every future I imagine.", icon: "sunrise" },
  ],
  // Edit the love letter here. Keep blank lines to preserve paragraph spacing.
  letter: `My dearest Nisha,

I may not always find the perfect words, but I hope you always understand what my heart is trying to say.

You entered my life so quietly, yet somehow you changed the way everything feels. Conversations became more meaningful, ordinary days became special, and the future started looking more beautiful.

I love your smile, your voice, your kindness, your cute anger, and even all your little nakhre. But more than anything, I love the feeling of peace I get simply from knowing that you are there.

This little website can never contain everything I feel for you. It is only a small reminder that in this enormous universe, finding you is one of the most beautiful things that has ever happened to me.

I choose you today, tomorrow, and in every version of my future.

Forever yours ❤️`,
  finale: [
    "No photographs were needed…",
    "Because every beautiful moment with you…",
    "Is already saved in my heart.",
  ],
} as const;

// Edit the main colour palette in app/globals.css under :root.
