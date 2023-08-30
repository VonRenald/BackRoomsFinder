# BackRoomsFinder
Programme python qui parcours les page de backrooms.fandom.com afin de trouver les Rooms et leur sorties.
Ce code forme un Json qui est utiliser par un JavaScript qui affiche la base de donnée et permet de la parcourire visuellement.

la détection de lien est réalisé par la présence hyper liens dans les sections Exits. Malheureusement les balises Exits peuvent etre différentes et encore non répertorié dans le code, si ce n'est pas symplement l'evocation de sortie sans y inclure d'hyperlien. Ce qui rend cette extraction incomplete. 
