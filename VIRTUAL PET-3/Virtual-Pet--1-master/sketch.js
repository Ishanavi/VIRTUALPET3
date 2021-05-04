var dog,dogim1,dogim2;
var foodS,foodStock;
var database;
var fedTime,lastFed;
var food;
var addFoodB,feedB;
var gameState,readState;

function preload()
{
  dogim1 = loadImage("images/dogImg.png");
  dogim2 = loadImage("images/dogImg1.png");
  bedroom = loadImage("images/Bed Room.png");
 
  garden = loadImage("images/Garden.png");
  
  washroom = loadImage("images/Wash Room.png");

}

function setup() {
  createCanvas(600, 600);

  database = firebase.database();
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  
  dog = createSprite(250,350,10,10);
  dog.addImage(dogim1);
  dog.scale = 0.2;




  food = new Food();
  
   readState=database.ref('gameState');
   readState.on("value",function(data){
     gameState=data.val();
   })
  
   fedTime = database.ref('FeedTime');
   fedTime.on("value",function(data){
     lastFed=data.val();
   })

   foodStock = database.ref('Food');
   foodStock.on("value",readStock)

  feedB = createButton("Feed the Dog");
  feedB.position(350,95);
  feedB.mousePressed(feedDog);

  addFoodB = createButton("Add Food");
  addFoodB.position(450,95);
  addFoodB.mousePressed(addFood);


}


function draw() 
{  
 // background(46,139,87);


  currentTime=hour(); 
  if(currentTime==(lastFed+1))
  { 
    update("Playing");
   food.garden();
   }

   else if(currentTime==(lastFed+2))
   { 
     update("Sleeping");
      food.bedroom(); 
  }


   else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4))
   { 
     update("Bathing");
      food.washroom(); 
  }

   else
   { 
     update("Hungry") 
    food.display(); 
   }



  if(gameState!="Hungry")
  {   
      feedB.hide();
      addFoodB.hide(); 
      dog.remove();
  }


     else
     { 
       feedB.show();
       addFoodB.show();
       dog.addImage(dogim1);
     }



    

 

  

 
  drawSprites();

}




function readStock(data)
{
  foodS = data.val();
  food.updateFoodStock(foodS);
}


/*function writeStock(x)
{

   if(x<=0)
   {
     x=0;
   }
   else
   {
     x=x-1;
   }


  database.ref('/').update({
      Food:x
    })
}
*/

function feedDog()
{
  dog.addImage(dogim2);

  food.updateFoodStock(food.getFoodStock()-1);
  database.ref('/').update({
    Food:food.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}


function addFood()
{
  foodS++
  database.ref('/').update({
    Food:foodS
  })
}


function update(state)
{
  database.ref('/').update({
    gameState:state
  })
}

