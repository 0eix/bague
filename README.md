## **Projet de modélisation et de rendu (WebGL2)**


| Enseignant  | Realisé par |
|---|---|
| Sylvain Thery |Ginette HOUNKPONOU |
|   | Elisée Othniel AMEGASSI  |

#### 1. Description du projet:
Modélisation en 3D d'un anneau serti d'un diamant avec deux 
shaders differents (un shader pour l'anneau, l'autre pour le diamant).

#### 2. Réalisation:
* Nous inspirant de la bibliothèque EasyWebGL nous avons écrit deux 
fonctions "Ring" et "Diamant" qui retournent respectivement les 
meshs de l'anneau et du diamant.
* Nous avons lié les deux shaders
* A chacun des deux meshs nous avons appliqué une texture
* Nous inspirant d'un [exemple sur le net](https://www.cs.toronto.edu/~jacobson/phong-demo/) nous avons appliqué un 
effet de lumiere (phong) pour avoir une texture plus brillante et 
un visuel realiste.

    <br/>
    <img src="./screenshot.png" width="600"/>