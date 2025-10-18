const voiceContainer = document.querySelector(".i-container");
const i = document.querySelector('i');
const inputContainer = document.querySelector('.input-container');
const stepsContainer = document.querySelector("#steps-container");
const prompt = document.getElementById('prompt');
const logo = document.getElementById("logo");

stepsContainer.style.display = "none";

stepsContainer.addEventListener("click", (e)=>{
    const step = e.target.closest(".step");
    if (!step) return;
    step.classList.toggle("active");
})


prompt.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (!prompt.value) {
            alert("Please input the dish name.")
            return
        };

        inputContainer.classList.add("active");
        logo.classList.add("active");
        logo.classList.add("rotate");
        generateCookSteps().then(() => {
            inputContainer.classList.remove("active");
            logo.classList.remove("rotate");
        });
    }
});

let session;

async function generateCookSteps() {
    const { defaultTemperature, maxTemperature, defaultTopK, maxTopK } =
        await LanguageModel.params();

    const available = await LanguageModel.availability();

    if (available !== 'unavailable') {
        session = await LanguageModel.create();

        const result = await session.prompt(`
Please respond in the same language as the input.
Extract the dish name from: "${prompt.value}".
List ingredients by detailed grams.
Then generate steps, numbered starting from 1.
Separate ingredients and steps with a line break.
`);

        stepsContainer.textContent = "";

        let cookSteps = result.split(/\d+\.\s/);

        cookSteps.length == 0 ? stepsContainer.style.display = "none" : stepsContainer.style.display = "flex";

        cookSteps.forEach((stepContents, index) => {

            setTimeout(() => {
                const step = document.createElement('div');
                step.className = "step";

                const stepIndex = document.createElement('div');
                stepIndex.className = "step-index";
                stepIndex.textContent = index + 1;


                const stepContent = document.createElement('div');
                stepContent.className = "step-content";
                stepContent.textContent = stepContents;

                step.append(stepIndex);
                step.append(stepContent);

                stepsContainer.append(step);

                const fullHeight = stepsContainer.scrollHeight;
                stepsContainer.style.height = fullHeight + "px";

            }, index * 200)
        })
    }
}

