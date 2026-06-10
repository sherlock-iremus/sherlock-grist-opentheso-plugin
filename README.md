![](https://repository-images.githubusercontent.com/1109242115/10bfd927-7bec-4821-97dd-2ea5c6202405)

# Usage (FR)

![](https://github.com/sherlock-iremus/sherlock-grist-opentheso-plugin/blob/main/doc/tuto.gif?raw=true)

La vidéo montre les différents cas d'utilisation du plugin : 
 - Affichage des concepts indexés pour la ligne courante
 - Recherche et ajout d'un concept
 - Suppression d'une indexation de concept

# Installation (FR)

## Table de configuration : indexes
Le tutoriel suivant explique comment intégrer le plugin, sur une table existante. 
Pour commencer, il faudra créer une table `indexes` telle que.
|               $Ressources_TID               |    $Referentiel_OTCSURI    |  $Descripteur_IDCN  |   $Descripteur_PLCN  |
| :------------------------------------: | :-------------: | :----------: |   :----------:  |

Ces colonnes représentent, dans l'ordre : 
- L'identifiant GRIST de table sur lequel le plugin va opérer
- L'URI du thésaurus sur lequel porte l'indexation 
- L'identifiant GRIST de la colonne qui contiendra les URI des concepts opentheso
- L'identifiant GRIST de la colonne qui contiendra les labels des concepts opentheso 

## Mise en exemple

Prenons l'exemple d'une collection d'images (identifiant GRIST de table "ICONOGRAPHIES") telle que :


|               ID Image               |    Nom image    |
| :------------------------------------: | :-------------: | 
| `c1bfbf91-ffeb-453f-9383-11a6d4d28a9e` | `Un lapin dans un champ` |
| `683827a5-56a5-4245-be59-070bf664d802` | `Le mariage du roy` |


On veut indexer des images avec des concepts du thésaurus [iconographie musicale](https://opentheso.huma-num.fr/?idt=iconographie-musicale).

Il faudra pour cela créer deux colonnes : 
- "Concept associé label" pour les labels des concepts indexés
- "Concept associé URI" pour les URIs des concepts indexés

Le choix des identifiants de colonne est au choix de l'utilisateur, on choisira ici `CAL` et `CAU`.

|               ID Image               |    Nom image    |  Concept associé label    | Concept associé URI |
| :------------------------------------: | :-------------: | :-------------: | :-------------:
| `c1bfbf91-ffeb-453f-9383-11a6d4d28a9e` | `Un lapin dans un champ` |
| `683827a5-56a5-4245-be59-070bf664d802` | `Le mariage du roy` |


En parallèle, il faudra donc remplir la table `indexes` comme suit : 

|               $Ressources_TID               |    $Referentiel_OTCSURI    |  $Descripteur_IDCN  |   $Descripteur_PLCN  |
| :------------------------------------: | :-------------: | :----------: |   :----------:  |
| `ICOONOGRAPHIES` | `https://opentheso.huma-num.fr/?idt=iconographie-musicale` | `CAL` | `CAU` |

Le plugin, est ensuite prêt à être ajouée à votre page

1. "Nouveau" ->  "Ajouter une vue à la page" -> "Personnalisés" -> Sélectionner votre table d'indexation -> Ne pas oublier de sélectionner une option dans le menu déroulant "Select by".
2. Menu "Choisir un widget personnalisé", sélectionner l'option "Ajouter votre propre widget URL personnalisée", et remplir avec l'URL https://sherlock-iremus.github.io/sherlock-grist-opentheso-plugin/

## FAQ

"J'ai créé mes colonnes d'indexationo mais elles le plugin affiche qu'elles sont manquantes"

⚠️ Chaque colonne ajoutée **après** installation du plugin se sera pas visible par défaut par le plugin. Pour ce faire, cliquez sur la vue du plugin, dans le panneau de création onglet "Personnalisée" -> "Colonnes cachées".

---

"Cela fait trop de colonnes à afficher"

⚠️ Vous pouvez cacher les colonnes de votre table d'indexation (comme les URI par exemple) en cliquant dessus, onglet "Table" -> "Colonnes visibles". Cela n'affectera pas le bon fonctionnement du plugin.


---

"Peut-on avoir plusieurs types d'indexation dans une même table ?"

Absolument, il faudra juste créer une ligne par type d'indexation dans la table `indexes`.