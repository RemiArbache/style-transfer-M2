# style-transfer-M2
## Projet académique d'expérimentation de Neural Style Transfer (Transfert de Style par réseau neuronal)

Basé sur [cet article](https://arxiv.org/abs/1705.06830) et [cette page TF Hub](https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2). 

---
- Rémi ARBACHE 
- Paul BUCAMP
- Eugénie DALMAS

---

Lancement du serveur :
```
python -m flask run
```

---
[TOC]

---
### Description
Ce projet a pour objectif la découverte du Neural Style Transfer (NST) à travers l’utilisation des modèles de d2l et de Google Brain. L'objectif est de réaliser un transfert d'une image de style à une image de contenu, et et de créer un site web d’application du modèle de Google Brain. 
Ce readMe permet d’expliquer la méthode de NST de d2l suivant un principe d’optimisation pour ensuite la comparer avec la méthode de Google Brain qui permet l’obtention en une boucle de l’image synthétisée sans entraînement préalable sur les images données en entrée.
Ce dépôt contient la mise en place d'un site web / API pour faire la démonstration de l’application du modèle choisi, créé par Google Brain, prenant des images en entrée pour donner en sortie l’image synthétisée.

### Introduction – Qu’est-ce que le Neural Style Transfer (NST) ?
Le NST permet, à partir d'une image de contenu (ex: une photo) et d'une image de référence de style (ex: une peinture), de créer une image qui maintienne le contenu de la première tout en reproduisant le style de la seconde. [Source](https://www.tensorflow.org/tutorials/generative/style_transfer )

Autrement dit, l’algorithme NST manipule des images dans le but de leur donner l’apparence ou le style visuel d’une autre image. Ces algorithmes utilisent des réseaux neuronaux profonds pour pouvoir réaliser la transformation d’images.

### Modèle d’optimisation avec d2l
Notre étude s'est tout d’abord portée sur le modèle NST de d2l se basant sur une optimisation par entraînement.

#### Données en entrée

// TODO

#### Pré-traitements

// TODO

#### Fonctionnement du modèle

De manière générale, le modèle tire parti des représentations en couches d’un réseau neuronal convolutif (CNN) afin d’appliquer automatiquement le style d’une image à une autre image. Pour cela, deux images sont utilisées : l’image de contenu et l’image de style. Un réseau neuronal est ensuite utilisé pour modifier l’image de contenu pour la rendre proche en style de l’image de style. Il s’agit donc de l’optimisation l’image de contenu avec l’image de style.

La méthode présentée par d2l considère l’image synthétisée (en sortie) comme les paramètres d’un modèle, initialisé avec l’image de contenu. 

L’algorithme utilise un modèle pré-entraîné d’extraction hiérarchique de caractéristiques. Composé de plusieurs couches, on peut choisir la sortie de certains d’entre eux comme caractéristique de contenu ou de style. 

Schéma exemple avec un CNN d’extraction de caractéristiques à 3 couches :

![](\images\CNN_example.png)




#### Conclusion et observations

### Modèle de prédiction avec Google Brain

#### Données en entrée
#### Pré-traitements
#### Fonctionnement du modèle
#### Conclusion et observations

### Site web d’application du modèle NST de Google Brain

### Ouverture
### Sources
- Article Google Brain, *Exploring the structure of a real-time, arbitrary neural artistic stylization network*  : https://arxiv.org/pdf/1705.06830.pdf 
- Tutoriel de NST d2l : https://d2l.ai/chapter_computer-vision/neural-style.html 
- Inception-v3, *Rethinking the Inception Architecture for Computer Vision* : https://arxiv.org/pdf/1512.00567.pdf 
- Code Inception-v3 GitHub : https://github.com/pytorch/vision/blob/6db1569c89094cf23f3bc41f79275c45e9fcb3f3/torchvision/models/inception.py#L64 
- Ouverture, transfert de style à du texte, *Text Style Transfer: A Review and Experimental Evaluation* : https://arxiv.org/pdf/2010.12742.pdf

