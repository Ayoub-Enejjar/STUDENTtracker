#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Student{
    int ID;
    char name[50];
    char attendence[10];
    struct Student *next;
};

struct Student* SaisiEtudiant(){
    struct Student *head = NULL;
    struct Student *current = NULL;
    struct Student *temp = NULL;
    int NombreEtudiant;
    int ID;
    char name[50], attendence[10];
    printf("Combien d'etudiant voulez vous ajouter?: ");
    if(scanf("%d", &NombreEtudiant) != 1 || NombreEtudiant <= 0){
        printf("Nombre d'étudiants invalide\n");
        return NULL;
    }
    
    for(int i=0; i<NombreEtudiant; i++){
        temp = malloc(sizeof(struct Student));
        if (temp==NULL){
            printf("Erreur d'allocation de memoire");
            return NULL;
        }
        printf("Entrez l'ID de l'etudiant %d: ",i+1);
        if(scanf("%d", &ID) != 1){
            printf("ID invalide\n");
            free(temp);
            return NULL;
        }
        printf("Entrez le nom de l'etudiant %d: ",i+1);
        if(scanf("%49s", name) != 1){  // Limit input to 49 chars
            printf("Nom invalide\n");
            free(temp);
            return NULL;
        }
        printf("Entrez l'assiduite de l'etudiant %d (Present/Abssent): ",i+1);
        if(scanf("%9s", attendence) != 1){  // Limit input to 9 chars
            printf("Assiduité invalide\n");
            free(temp);
            return NULL;
        }
                          
        temp->ID=ID;
        strcpy(temp->name,name);
        strcpy(temp->attendence,attendence);
        temp->next=NULL;

        if(head==NULL){
            head=temp;
        }
        else{
            current->next=temp;
        }
        current=temp; 
    }  
    return head; 
}

struct Student* RechercherEtudiant(struct Student* head, int searchID){
    struct Student *current = head;
    while(current!=NULL){
        if(current->ID==searchID){
            return current;
        }
        current=current->next; //Il parcourt la liste en passant d’un nœud au suivant via le champ next
    }
    return NULL;
}

void MarkAttendence(struct Student *head, int ID){
    struct Student* student = RechercherEtudiant(head, ID);
    int studentID;
    int choice;
    printf("Marquer l'assiduité ");
    printf("Entrez l'ID de l'etudiant: ");
    scanf("%d",&studentID);
    student=RechercherEtudiant(head,studentID);
    if(student==NULL){
        printf("Etudiant non trouver\n");
        return;
    }

    printf("Etudiant trouver: %s\n",student->name);
    printf("1.Present\n");
    printf("2.Absent\n");
    printf("choisissez lassiduite (1-2): ");
    scanf("%d",&choice);

    switch(choice){
        case 1:
        strcpy(student->attendence,"Present");
        break;
        case 2:
            strcpy(student->attendence, "Absent");
            break;  
        default:
            printf("choix invalide\n");
            break;
    }
}


void CompterPresenceAbsence(struct Student *head){
    int presents = 0;
    int absents = 0;
    struct Student* current = head;

    while(current!=NULL){
        if(strcmp(current->attendence,"Present")==0){  
            presents++;
        }
        else{
            if(strcmp(current->attendence,"Absent")==0)
                absents++;
     
        }
        current=current->next; 
        }
        printf("statistique de presence\n");
        printf("Nombre d'etudiant presents: %d\n",presents);
        printf("Nombre d'etudiant absents: %d\n",absents);
        printf("Nombre d'etudiant total: %d\n",presents+absents);
    }

int main(){
    struct Student *head = NULL;
    struct Student *current = NULL;
    int choice;
     head = SaisiEtudiant();
     if(head==NULL){
         return 1;
     }

    do {
        printf("1.Afficher la lise des etudiants\n");
        printf("2.Marquer l'assiduite\n");
        printf("3.Afficher les statiques de presence\n");
        printf("4.Sortir\n");
        printf("choisissez une option (1-4): ");
        scanf("%d",&choice);

        switch(choice){
            case 1:
            printf("liste des etudiants\n");
            current=head;
            while(current!=NULL){
                printf("------------------------------------------------------\n");
                printf("ID: %d, name: %s, attendence: %s\n", 
                       current->ID, current->name, current->attendence);
                printf("------------------------------------------------------\n");
                current = current->next;
            } 
            break; 
            case 2:
            MarkAttendence(head , 1);
            break;
            case 3:
            CompterPresenceAbsence(head);
            break;
            case 4:
            printf("Existing. . . . . . .\n");
            break;

            default:
            printf("choix invalide\n");
        }
    } while(choice != 4);
    
    current=head;

    while(current!=NULL){
        struct Student *temp = current;
        current = current->next;
        free(temp);
    }
    head = NULL;  
    return 0;
} 