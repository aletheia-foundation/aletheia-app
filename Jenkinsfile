pipeline {
    agent any
    tools { nodejs "node9.4" }
    stages {
        stage('Publish build results') {
            steps {
                withCredentials([string(credentialsId: 'aletheia-ci-user-access-token', variable: 'SECRET')]) {
                    echo 'secret loaded'
                    githubNotify context: '$SECRET', description: 'This is a shorted example',  status: 'SUCCESS'
                }
            }
        }
        stage('Build') {
            steps {
                echo 'build stage'
                sh 'blahs && npm install'
            }
        }
        stage('Test') {
            steps {
                echo 'test stage'
                sh 'npm run test:ci'
                sh 'npm run test-truffle:ci'
            }
        }
        stage('Generate app builds') {
            steps {
                echo 'Generate app builds stage'
                sh 'npm run electron:linux'
                archiveArtifacts artifacts: 'app-builds/**', fingerprint: true
            }
        }
        stage('Deploy contracts') {
            steps {
                echo 'deploy contracts stage'
            }
        }
    }
}