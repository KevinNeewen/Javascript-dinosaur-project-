    // Create Dino Objects
    function Dino(species, fact, image) {
        this.species = species;
        this.fact = fact;
        this.image = image;
    }

    // Create Human Object
    function Human(name, height, weight, diet) {
        this.name = name;
        this.height = height;
        this.weight = weight;
        this.diet = diet;
        this.image = `images/human.png`;
    }

    function createHumanFromForm() {
        let name = document.getElementById('name').value;
        
        let weight = document.getElementById('weight').value;
        
        let dietOptions = document.getElementById('diet');
        let diet = dietOptions.options[dietOptions.selectedIndex].text;
        
        let feet = document.getElementById('feet').value;
        let inches = document.getElementById('inches').value;
        let height = utils().convertFeetToInches(feet) + inches;
        
        return new Human(name, height, weight, diet);
    }

    function getDinosaurDtosFromJson() {
        return fetch('dino.json')
            .then(response => response.json())
            .then(data => data);
    }

    function utils() {       
        function convertFeetToInches(feet) {
            return feet*12;
        }
        
        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
        
        function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
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

    function dinoFactory(human, dinosaurDto) {
        let compareFacts = [
            generateCompareWeightFact,
            generateCompareHeightFact,
            generateCompareDietFact
        ];
        
        let randomFactNum = utils().getRandomInt(compareFacts.length);
        let generateRandomFact = compareFacts[randomFactNum];
        
        let dinoFact = dinosaurDto.species === 'Pigeon' 
            ? dinosaurDto.fact 
            : generateRandomFact(human, dinosaurDto);
        
        const imagePath = `images/${dinosaurDto.species}.png`;
        
        return new Dino(dinosaurDto.species, dinoFact, imagePath);
    }

    // Create Dino Compare Method 1
    // NOTE: Weight in JSON file is in lbs, height in inches. 
    function generateCompareWeightFact(human, dinosaurDto) {
        if(human.weight * 80 > dinosaurDto.weight) {
            return `${dinosaurDto.species} weigh on average ${dinosaurDto.weight} lbs.`
        }
        return dinosaurDto.fact;
    }
    
    // Create Dino Compare Method 2
    // NOTE: Weight in JSON file is in lbs, height in inches.
    function generateCompareHeightFact(human, dinosaurDto) {
        if(human.height < dinosaurDto.height) {
            return `${dinosaurDto.species} are on average ${dinosaurDto.height} inches tall.`
        }
        return dinosaurDto.fact;
    }
    
    // Create Dino Compare Method 3
    // NOTE: Weight in JSON file is in lbs, height in inches.
    function generateCompareDietFact(human, dinosaurDto) {
        if(human.diet.toLowerCase() === dinosaurDto.diet) {
            return `${dinosaurDto.species} are also ${dinosaurDto.diet}s.`
        }
        return dinosaurDto.fact;
    }

    function generateGrid(human, dinosaurs) {
        function generateDinosaurTile(dino, index) {
            const dinoElement = document.createElement('div')
            dinoElement.className = `grid-item dino-${index}`
            
            const dinoParagraph =  document.createTextNode(dino.fact)
            
            const dinoImage = document.createElement('img')
            dinoImage.src = dino.image
            
            const dinoHeader = document.createElement('h3')
            const dinoHeaderText =  document.createTextNode(dino.species)
            dinoHeader.appendChild(dinoHeaderText)
            
            dinoElement.appendChild(dinoHeader)
            dinoElement.appendChild(dinoParagraph)
            dinoElement.appendChild(dinoImage)
            
            return dinoElement
        }
        
        function generateHumanTile(human) {
            const humanElement = document.createElement('div')
            humanElement.className = 'grid-item'       

            const humanName = document.createTextNode(human.name)
            const humanHeader = document.createElement('h3')
            humanHeader.appendChild(humanName)

            const humanImage = document.createElement('img')
            humanImage.src = human.image


            humanElement.appendChild(humanImage)
            humanElement.appendChild(humanHeader)

            return humanElement
        }
        
        let grid = document.getElementById('grid')
        
        dinosaurs.forEach((dino,index) => {
            const dinoTile = generateDinosaurTile(dino, index)
            grid.appendChild(dinoTile)
        })
        
        const humanTile = generateHumanTile(human)
        
        const dinoToInsertBefore = document.getElementsByClassName('dino-4')[0]
        grid.insertBefore(humanTile, dinoToInsertBefore)
    }

    // Remove form from screen

// On button click, prepare and display infographic
async function displayInfographic(){
    let human = createHumanFromForm();

    let dinosaurDtos = await getDinosaurDtosFromJson();
    
    let dinosaurs = createDinosaursWithRandomFacts(human, dinosaurDtos.Dinos);
    
    utils().shuffleArray(dinosaurs)
    
    generateGrid(human, dinosaurs)
}