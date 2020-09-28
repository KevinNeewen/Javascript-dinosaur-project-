    function Dino(species, fact, image) {
        this.species = species;
        this.fact = fact;
        this.image = image;
    }

    function Human(name, height, weight, diet) {
        this.name = name;
        this.height = height;
        this.weight = weight;
        this.diet = diet;
        this.image = `images/human.png`;
    }

    function createHumanFromForm() {
        const name = document.getElementById('name').value;
        
        const weight = document.getElementById('weight').value;
        
        const dietOptions = document.getElementById('diet');
        const diet = dietOptions.options[dietOptions.selectedIndex].text;
        
        const feet = document.getElementById('feet').value;
        const inches = document.getElementById('inches').value;
        const height = utils().convertFeetToInches(feet) + inches;
        
        return new Human(name, height, weight, diet);
    }

    function getDinosaurDataObjectsFromJson() {
        return fetch('dino.json')
            .then(response => response.json())
            .then(data => data);
    }

    //Utility functions
    function utils() {       
        function convertFeetToInches(feet) {
            return feet*12;
        }
        
        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
        
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                let temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }

        return {
            convertFeetToInches: convertFeetToInches,
            getRandomInt: getRandomInt,
            shuffleArray: shuffleArray
        };
    }

    function createDinosaursWithRandomFacts(human, dinosaurDtos) {
        return dinosaurDtos.map(dino => dinoFactory(human, dino));
    }

    //Creates a Dino object with a random fact
    function dinoFactory(human, dinosaurDto) {
        let compareFacts = [
            generateCompareWeightFact,
            generateCompareHeightFact,
            generateCompareDietFact
        ];
        
        const randomFactNum = utils().getRandomInt(compareFacts.length);
        const generateRandomFact = compareFacts[randomFactNum];
        
        const dinoFact = dinosaurDto.species === 'Pigeon' 
            ? dinosaurDto.fact 
            : generateRandomFact(human, dinosaurDto);
        
        const imagePath = `images/${dinosaurDto.species.toLowerCase()}.png`;
        
        return new Dino(dinosaurDto.species, dinoFact, imagePath);
    }

    // Create Dino Compare Method 1
    function generateCompareWeightFact(human, dinosaurDto) {
        let dinoFact = dinosaurDto.fact;
        
        if(human.weight * 80 > dinosaurDto.weight) {
            dinoFact = `${dinosaurDto.species} weigh on average ${dinosaurDto.weight} lbs.`;
        } else if(human.weight * 80 < dinosaurDto.weight) {
            dinoFact = `${dinosaurDto.species} originated from ${dinosaurDto.where}.`;
        }
        
        return dinoFact;
    }
    
    // Create Dino Compare Method 2
    function generateCompareHeightFact(human, dinosaurDto) {
        let dinoFact = dinosaurDto.fact;
        
        if(human.height < dinosaurDto.height) {
            dinoFact = `${dinosaurDto.species} are on average ${dinosaurDto.height} inches tall.`;
        } else if(human.height > dinosaurDto.height) {
            dinoFact = `${dinosaurDto.species} existed during the ${dinosaurDto.when} period.`;
        }
        
        return dinoFact;
    }
    
    // Create Dino Compare Method 3
    function generateCompareDietFact(human, dinosaurDto) {
        if(human.diet.toLowerCase() === dinosaurDto.diet) {
            return `${dinosaurDto.species} are also ${dinosaurDto.diet}s.`;
        }
        return dinosaurDto.fact;
    }

    function generateGrid(human, dinosaurs) {
        function generateDinosaurTile(dino, index) {
            const dinoElement = document.createElement('div');
            dinoElement.className = `grid-item dino-${index}`;
            
            const dinoParagraph =  document.createTextNode(dino.fact);
            
            const dinoImage = document.createElement('img');
            dinoImage.src = dino.image;
            
            const dinoHeader = document.createElement('h3');
            const dinoHeaderText =  document.createTextNode(dino.species);
            dinoHeader.appendChild(dinoHeaderText);
            
            dinoElement.appendChild(dinoHeader);
            dinoElement.appendChild(dinoParagraph);
            dinoElement.appendChild(dinoImage);
            
            return dinoElement;
        }
        
        function generateHumanTile(human) {
            const humanElement = document.createElement('div');
            humanElement.className = 'grid-item';

            const humanImage = document.createElement('img');
            humanImage.src = human.image;
            
            const humanName = document.createTextNode(human.name);
            const humanHeader = document.createElement('h3');
            humanHeader.appendChild(humanName);

            humanElement.appendChild(humanHeader);
            humanElement.appendChild(humanImage);

            return humanElement;
        }
        
        const grid = document.getElementById('grid');
        
        dinosaurs.forEach((dino,index) => {
            const dinoTile = generateDinosaurTile(dino, index);
            grid.appendChild(dinoTile);
        });
        
        const humanTile = generateHumanTile(human);
        
        const dinoToInsertBefore = document.getElementsByClassName('dino-4')[0];
        
        grid.insertBefore(humanTile, dinoToInsertBefore);
    }

    // Remove form from screen
    function hideForm() {
        const formElement = document.getElementById('dino-compare');
        formElement.style.display = 'none';
    }

    // On button click, prepare and display infographic
    async function displayInfographic(){
        const human = createHumanFromForm();

        const dinosaurDtos = await getDinosaurDataObjectsFromJson();

        const dinosaurs = createDinosaursWithRandomFacts(human, dinosaurDtos.Dinos);

        utils().shuffleArray(dinosaurs);

        generateGrid(human, dinosaurs);

        hideForm();
    }