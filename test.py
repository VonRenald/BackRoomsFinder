import os
import json


def extract_link(nstr):
    for word in nstr.split():
        if 'href="' in word and 'Level' in word and len(word) < 60 and '/wiki/Backrooms_Wiki:Levels' not in word:
            room = word[:len(word)-1][12+6:]
            if room not in next_room_list and room not in room_see :
                next_room_list.append(room)
            if room not in next_this_room_list:
                next_this_room_list.append(room)

global next_room_list 
global room_see
global next_this_room_list
next_room_list = []
room_see = []
next_this_room_list = []
it = 0
dic_exit = {}

json_file = []





os.system("curl https://backrooms.fandom.com/wiki/Level_List > test.txt")
f = open("test.txt", "r", encoding="utf8")
nl=0
nstr=""
while nl<2347: # 1189 2347
    nl+=1
    nstr = f.readline()
    if nl > 1115:
        extract_link(nstr)
f.close() 

print(next_room_list)

# exit()

while len(next_room_list)>0: #and it < 100:
    it += 1
    print(it,"-",len(next_room_list))
    next_this_room_list = []
    room = next_room_list[0]
    next_room_list = next_room_list[1:]
    room_see.append(room)
    # print(room,next_room_list,room_see)
    os.system("curl https://backrooms.fandom.com/wiki/Level_"+room+" > test.txt")
# os.system("curl https://backrooms.fandom.com/wiki/Level_2 > test.txt")
    f = open("test.txt", "r", encoding="utf8")
    nl=0
    nstr=""
    state=0
    nl_save = 0
    while True:
        nl+=1
        nstr =f.readline()
        if len(nstr) == 0 :
            break


        if state==0:
            if 'id="Exits"' in nstr or 'id="【𝐕𝐈.𝟐_𝐄𝐱𝐢𝐭𝐬】"' in nstr or 'id=">>_Exits:"' in nstr:
                state=1
        elif state==1 :
            if '<ul>' in nstr:
                state = 2
                nl_save = nl
                extract_link(nstr)
                if '</ul>' in nstr:
                    state=3
            if '<p>' in nstr:
                state = 4
                nl_save = nl
                extract_link(nstr)
                if '</p>' in nstr:
                    state=1
                    if '<ul>' in nstr:
                        state = 2
                        if '</ul>' in nstr:
                            state = 3
        elif state==2:
            extract_link(nstr)
            if '</ul>' in nstr:
                state=3
        elif state == 4:
            extract_link(nstr)
            if '</p>' in nstr:
                state=1
                if '<ul>' in nstr:
                    state = 2
                    if '</ul>' in nstr:
                        state = 3

    # print(it,next_room_list,room_see)

    # print(nl)
    f.close()
    dic_exit[room]=next_this_room_list

    j_id = room
    j_exit = dic_exit[room]
    json_file.append({"room":j_id,"exit":j_exit}) 
print(dic_exit)
f = open("link.json", "a")
f.write(json.dumps(json_file))
f.close()
