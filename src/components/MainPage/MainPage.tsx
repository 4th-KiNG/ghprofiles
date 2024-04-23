import styles from './MainPage.module.scss'
import { useState} from 'react'
import axios from 'axios'
import search from '../../assets/search.svg'
const MainPage = () => {
    const [userName, setUserName] = useState<string | null>(null)
    const [user, setUser] = useState<any>(null)
    const [showuser, setshowuser] = useState(false)
    const [repData, setRepData] = useState<any>(null)
    const getUser = async () => {
        try{
            const userResponse = await axios.get(`https://api.github.com/users/${userName}`)
            setUser(userResponse.data)
            
            console.log(userResponse.data)
            const reposUrl = userResponse.data.repos_url;
            const reposRepos = await axios.get(`${reposUrl}`)
            setRepData(reposRepos.data)
            console.log(reposRepos.data)
            setshowuser(true)
        }
        catch(e){
            console.log(e)
        }
    }
    interface UserProps{
        name: string | null,
        avatar: string,
        htmlUrl: string,
        login: string,
        date: string,
        repcount: number
    }
    const User = (props: UserProps) => {
        return(
            props.login != null ? 
            <>
            <div className={styles.User}>
                <h1 className={styles.User_Login}>{props.login}</h1>
                <div className={styles.User_MainInfo}>
                    <div className={styles.User_MainInfo_Container1}>
                        <img src={props.avatar} className={styles.User_Avatar} alt="" />
                        <a href={`${props.htmlUrl}`} className={styles.User_MainInfo_Link}>Go to profile</a>
                    </div>
                    <div className={styles.User_MainInfo_Container2}>
                        <p>Name: {props.name == null ? "Not indicated" : props.name}</p>
                        <p>Created at: {props.date.split("T")[0]}</p>
                        <p>Count of public repositories: {props.repcount}</p>
                    </div>
                    <div className={styles.User_MainInfo_Repos}>
                        {repData.map((rep: any) => {
                            return(
                                <a href={`${rep.html_url}`} className={styles.User_MainInfo_Repos_Rep}>
                                    <p>Название проекта: {rep.name}</p>
                                    <p>Язык: {rep.language == null ? "Not indicated" : rep.language}</p>
                                </a>
                            )
                        })}
                    </div>
                </div>
            </div>
            </>
            : <div>Loading...</div>
        )
    }
    return (
        <>
        <div className={styles.MainPage}>
            <h1 className={styles.MainPage_Title}>Welcome to GitHub Profiles</h1>
            <p className={styles.MainPage_Description}>Search github profile by login</p>
            <div className={styles.InputAndButton}>
            <div className={styles.Input}><img src={search} className={styles.Input_Ico} alt="" /><input placeholder='Enter login' type="text" className={styles.Input_Input} onChange={(e) => setUserName(e.target.value)}  /></div>
            <button onClick={getUser} className={styles.MainPage_Enter}><span>Search</span></button>
            </div>
            {showuser && <User repcount={user.public_repos} date={user.created_at} name={user.name} avatar={user.avatar_url} htmlUrl={user.html_url} login={user.login} />}
        </div>
        </>
    );
}
 
export default MainPage;