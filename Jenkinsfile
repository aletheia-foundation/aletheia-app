pipeline {
    agent any
    tools { nodejs "node9.4" }
    stages {
        stage('Build') {
            steps {
                echo 'build stage'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test:ci'
            }
        }
        stage('Deploy') {
            steps {
                echo 'deploy stage'
            }
        }
    }
}