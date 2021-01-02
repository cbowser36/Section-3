import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router) { }

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
        }
    )
  }
 onSubmit(){
   if(this.editMode){
     this.recipeService.updateRecipe(this.id,this.recipeForm.value)
   } else {
     this.recipeService.addRecipe(this.recipeForm.value);
   }
   this.onCancel();
 }

 onAddIngridient(){
   (<FormArray>this.recipeForm.get('ingridients')).push(
     new FormGroup({
       'name': new FormControl(null, Validators.required),
       'amount': new FormControl(null,[
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ])
     })
   )
 }
 onDeleteIngridient(index: number){
   (<FormArray>this.recipeForm.get('ingridients')).removeAt(index);
 }


 onCancel(){
   this.router.navigate(['../'],{relativeTo: this.route});

 }


  private initForm(){
    let recipeName = '';
    let recipeImage = '';
    let recipeDescription = '';
    let recipeIngridients = new FormArray([]);


    if(this.editMode){
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImage = recipe.imagePath;
      recipeDescription = recipe.description;
      if(recipe['ingridients']){
        for (let ingridient of recipe.ingridients){
          recipeIngridients.push(
            new FormGroup({
              'name': new FormControl(ingridient.name,Validators.required),
              'amount': new FormControl(ingridient.amount,[
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          );
        }
      }
    }
  this.recipeForm = new FormGroup({
    'name': new FormControl(recipeName, Validators.required),
    'imagePath': new FormControl(recipeImage,Validators.required),
    'description': new FormControl(recipeDescription,Validators.required),
    'ingridients': recipeIngridients
  });
  }

}
