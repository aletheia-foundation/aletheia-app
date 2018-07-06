pipeline {
    agent any
    stages {
        stage('Deploy bootnode') {
            steps {
                echo 'deploying testnet bootnode'
                sh 'ls -al scripts'
                sshPublisher(
                        publishers: [sshPublisherDesc(
                                configName: 'aletheia-infrastructure',
                                verbose: true,
                                transfers: [ sshTransfer (
                                        sourceFiles: 'scripts/**/*.*',
                                        remoteDirectory: '/var/aletheia-bootnode/bootnode',
                                        execCommand: 'sudo /var/aletheia-bootnode/restart-bootnode.sh'
                                )]
                        )]
                )
            }
        }
    }
}