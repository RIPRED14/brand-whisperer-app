#!/usr/bin/env pwsh
# Script pour mettre à jour automatiquement le dépôt GitHub
# Sauvegardez ce fichier dans le dossier racine du projet

Write-Host "===== Mise à jour automatique vers GitHub =====" -ForegroundColor Green

# Vérifier les modifications
Write-Host "Vérification des modifications..." -ForegroundColor Cyan
git status

# Ajouter toutes les modifications
Write-Host "Ajout des modifications..." -ForegroundColor Cyan
git add .

# Demander un message de commit à l'utilisateur
$commitMessage = Read-Host "Message de commit (laissez vide pour 'Mise à jour automatique')"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Mise à jour automatique du $(Get-Date -Format 'dd-MM-yyyy HH:mm')"
}

# Créer un commit avec le message fourni
Write-Host "Création du commit..." -ForegroundColor Cyan
git commit -m "$commitMessage"

# Pousser les modifications vers GitHub
Write-Host "Envoi des modifications vers GitHub..." -ForegroundColor Cyan
git push -u origin master

Write-Host "===== Mise à jour terminée avec succès! =====" -ForegroundColor Green

# Attendre que l'utilisateur appuie sur une touche avant de fermer
Write-Host "Appuyez sur une touche pour fermer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 