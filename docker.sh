#!/bin/bash

# Alterar permissões - [ 7 (rwx para usuario)  7 (rwx para grupo)  0 (--- para outros)  ]
sudo chmod -R 777 postgres-data/


# Alterar propriedade - muda o dono do diretório para o usuário atual
sudo chown -R $(whoami):$(whoami) postgres-data/
