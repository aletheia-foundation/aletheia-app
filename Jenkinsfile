GIT_COMMIT_HASH = sh (script: "git log -n 1 --pretty=format:'%H'", returnStdout: true)
pipeline {
    agent any
    tools { nodejs "node9.4" }
    stages {
        stage('Publish build results') {
            steps {
                echo GIT_COMMIT_HASH
                githubNotify  credentialsId: 'aletheia-ci-user-access-token',
                    repo: 'aletheia-app',
                    account: 'aletheia-ci-user'
                    sha: '${GIT_COMMIT_HASH}',
                    description: 'This is a shorted example',
                    status: 'SUCCESS'
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