pipeline {
    agent any
    tools { nodejs "node9.4" }
    stages {
        stage('Build') {
            echo 'build stage'
        }
        stage('Test') {
            echo 'npm run test:ci'
        }
        stage('Deploy') {
            echo 'deploy stage'
        }
    }
}