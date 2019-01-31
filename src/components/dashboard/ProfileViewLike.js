import React from 'react';
import { imgPath, toCapitalize } from 'helpers';
import { Link } from 'react-router-dom';
import userService from 'services/user-service';
export class ProfileViewLike extends React.Component {

    constructor(){
        super()
        this.state ={
            profiles: [],
            isLoading : true
        }
        this.renderProfiles = this.renderProfiles.bind(this);
    }
    componentDidMount(){
        return userService.getNotificationsType(this.props.type).then((profiles)=>{
            this.setState({profiles: profiles.data, isLoading : false})
        })
        .catch((err) => {console.log(err)})
    }
    renderProfiles(profiles){
        return profiles.map((profile, index) => {
            let className;
            profile.online === 0 ? className = "one-profile" : className = "one-profile online"
            return(
                <Link key={index} to={`/profile/${profile.username}`}>
                    <div className={className} id={profile.username}>
                        <div className="img">
                        <img src={ imgPath(profile.profile_img)} alt="profile_img"/>
                        </div>
                        <h4>{toCapitalize(profile.username)}</h4>
                    </div>   
                </Link>           
            )
        });
    }
    render(){
        const {profiles, isLoading }= this.state
        return(
            <div className="profiles-display">
                {!isLoading && profiles.length > 0 &&
                    this.renderProfiles(profiles) 
                }
                {!isLoading && !profiles.length &&  
                    <h2>You don't have any activity yet ...</h2>
                }
            </div>
        )
    }
}
