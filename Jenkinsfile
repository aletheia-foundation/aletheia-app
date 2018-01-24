pipeline {
    agent any
    tools { nodejs "node9.4" }
    stages {
        stage('Build') {
            steps {
                echo 'build stage'
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                echo 'test stage'
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